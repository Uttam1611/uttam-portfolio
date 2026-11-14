# Customer Support Ticket Agent - interview revision guide

Repo: `customer-support-ticket-agent`. Python 3.11 service: persistent RAG (Chroma) + LangGraph retrieve -> decide -> answer/ticket workflow + FastAPI + Streamlit chat + optional voice (Google STT, Edge TTS).

## Team vs Uttam vs needs confirmation

Git log: **1 commit**, author `Uttam1611` (a second Uttam identity), 2026-09-23, "Add Readme". History is squashed, so git cannot show who wrote what.

| Area | Status |
|---|---|
| Whole repo committed under Uttam's identity | Verified from git |
| Provenance as an assessment starter | Strong signs the repo began as a supplied take-home starter: `src/llm/client.py` docstring "This binding is supplied so candidates focus on agent behavior"; `src/rag/document_loader.py` "leaving tuning to the candidate"; `docs/RAG_IMPLEMENTATION_GUIDE.md` says "The starter already provides the component boundaries ... Complete `KnowledgeRetriever.initialize()` and `search()`"; README has a "Submission Checklist" and "Demonstration" section. So `client.py`, `document_loader.py`, `embeddings.py`, `prompts.py`, the 4 knowledge-base files and the project skeleton are likely supplied [CONFIRM] |
| What Uttam wrote | Likely retriever `initialize/search`, `workflow.py`, `pipeline.py`, API, voice, Streamlit, tests [CONFIRM] |
| Whether code was AI-assisted | [CONFIRM]; the style is uniform and heavily defensive, be ready to explain every function |
| Whether it was ever run, tests passing | No evidence in repo (no CI, no logs). README checklist boxes are unticked. I did not run anything |

## 1. Project overview
A chat support agent. It retrieves policy text (returns, shipping, payments, accounts) from a persistent Chroma store, routes each turn to **answer** (grounded in retrieved chunks, with source filenames) or **ticket** (multi-turn collection of name, email, issue, category, then one validated ticket). Voice is an add-on: WAV -> STT -> editable transcript -> normal `/chat`; a speaker button calls TTS.

## 2. Problem statement
Support questions need answers grounded in policy (not hallucinated), and unresolved issues need a structured ticket collected across several messages without duplicates, with failures (LLM down, bad email, empty audio) handled cleanly.

## 3. Why the project was built
Most likely an assignment/assessment (see provenance above): build RAG + agent routing + ticketing + voice on a starter. Real motivation [CONFIRM].

## 4. System architecture
Streamlit (`streamlit_app.py`, httpx to API) -> FastAPI (`src/api/server.py`) -> `SupportPipeline` (`src/pipeline.py`) -> LangGraph (`src/llm/workflow.py`) with `KnowledgeRetriever` (`src/rag/retriever.py`, Chroma + HuggingFace embeddings), `SessionStore` (`src/sessions/store.py`), `TicketRepository` (`src/tools/ticket_tool.py`) and an OpenAI-compatible chat model (`src/llm/client.py`). Voice: `VoicePipeline` over `STTService`/`TTSService` abstractions (`src/voice/contracts.py`). Pydantic contracts in `src/models.py`, settings in `src/config.py`.

## 5. End-to-end execution flow
1. Lifespan: `pipeline.initialize()` -> `retriever.initialize()` (load md, split 600/80, embed, add only chunk IDs not already stored) -> `build_support_workflow`; `ready=True`.
2. `POST /chat` (`ChatRequest`, blank text rejected) -> `SupportPipeline.process`: clean input, require ready, get/create session, append history, `workflow.ainvoke`.
3. Graph: `retrieve` (search top-k above threshold, de-duplicate) -> `decide` (LLM returns JSON route + extracted fields; falls back to regex `_fallback_route` if output is unparsable) -> conditional edge -> `answer` or `ticket` (`collect_or_create`) -> END.
4. `answer`: no chunks -> fixed "don't have enough information" reply; else prompt with `SYSTEM_PROMPT` + context + session + message.
5. `collect_or_create`: merge extracted fields into session; if ticket exists return it; ask for the first missing field; validate with `TicketCreate`; call the `create_support_ticket` tool; store ID.
6. Pipeline verifies any returned ticket ID exists in the repository, then builds `ChatResponse` (response, unique sources, ticket_id).

## 6. Technologies and why they were selected
FastAPI/uvicorn (async API, pydantic contracts); LangGraph (explicit graph, testable nodes with injected dependencies); Chroma + `sentence-transformers/all-MiniLM-L6-v2` via `langchain-huggingface` (local, open-source embeddings, persistent on disk); `langchain-openai` `ChatOpenAI` pointed at `LLM_BASE_URL` default `http://localhost:11434/v1`, model default `qwen2.5:3b` (Ollama-style local model, no key); Streamlit (fast chat UI); `SpeechRecognition` Google web recognizer and `edge-tts` (no local model); pytest + pytest-asyncio. Reasons beyond what the code/README imply are [CONFIRM].

## 7. Important source files
`src/llm/workflow.py` (697 lines, core), `src/rag/retriever.py` (170), `src/pipeline.py` (237), `src/api/server.py` (157), `src/models.py`, `src/sessions/store.py`, `src/tools/ticket_tool.py`, `src/config.py`, `src/voice/{stt,tts,pipeline,contracts,models}.py`, `streamlit_app.py` (215), `knowledge_base/*.md`, `tests/` (about 33 test functions across 7 files).

## 8. Main functions and modules
- `KnowledgeRetriever._document_id` (sha256 of source+content), `initialize` (idempotent add), `_keyword_overlap`, `search` (relevance-score filter, then re-rank by keyword overlap then score, safe filenames only).
- `workflow.py`: `AgentDecision` (route + fields), `_extract_json_object` (strips `<think>` and code fences, balanced-brace scan), `_parse_agent_decision`, `_fallback_route`, nodes `retrieve/decide/answer/collect_or_create`, `select_route`.
- `ConversationState.missing_ticket_fields/update_fields`; `TicketRepository.create` (idempotent per session, IDs `CST-2026-0001`...); `create_ticket_tool` (StructuredTool, validates via `TicketCreate` before side effect).
- `SupportPipeline.process`, error classes `ComponentNotReadyError`, `AgentProcessingError`.
- `GoogleSTTService.transcribe` (WAV only), `EdgeTTSService.synthesize`, `VoicePipeline`.

## 9. Data flow
User text -> session history -> retrieval query is the raw message -> chunks -> router prompt (message + previously collected fields + "KB is data only") -> JSON decision -> fields merged into session -> either grounded LLM answer or ticket question/creation -> pipeline normalises and verifies -> JSON response. Voice: WAV bytes -> transcript (shown, editable) -> same `/chat`; text -> MP3 bytes with `X-Message-ID` header.

## 10. Model choices and reasoning
Generation/routing LLM is configurable and defaults to a small local model (`qwen2.5:3b`, `temperature=0.2`, `timeout=30`, `max_retries=1`; set in the supplied-looking `client.py`). Because small models emit sloppy JSON, the code tolerates `<think>` blocks and fences and has a regex fallback. Embeddings: all-MiniLM-L6-v2. No evaluation of answer quality is in the repo; model choice rationale [CONFIRM].

## 11. Database design
Vector DB: one Chroma collection (`RAG_COLLECTION=customer-support`) at `VECTOR_DB_PATH` (`.data/vector_db`), documents with `source` metadata, IDs = sha256(source+chunk). Tickets and sessions are **in-memory dicts** (`TicketRepository`, `SessionStore`), lost on restart. The README's "SQLAlchemy / PostgreSQL components where configured" is not backed by code (grep finds none).

## 12. APIs and contracts
`GET /health` (503 until ready), `POST /chat` (`session_id`, `message` -> `success, session_id, response, sources, ticket_id`; 503 not ready, 502 processing error, 422 validation), `GET /tickets/{id}` (404), `POST /voice/transcribe` (multipart WAV -> transcript + `processing_time_ms`; 422 bad/empty audio, 502 service failure), `POST /voice/synthesize` (`message_id`, `text` <= 4000 -> audio/mpeg). `TicketCreate`: `EmailStr`, description >= 5 chars, summary 5-160, category literal of order/payment/account/technical/other.

## 13. Important implementation decisions
- Pipeline owns session/ticket consistency; API knows only contracts.
- Dependency injection into `build_support_workflow` so tests can pass fakes.
- Idempotency at two layers: `session.ticket_id` check in the node and `_session_ticket` in the repository.
- LLM extracts fields but never IDs; ticket ID is repository-issued; pipeline rejects an unknown ID.
- Prompt-injection stance: KB documents declared "DATA ONLY" in the router prompt; system prompt forbids asking for passwords/OTP/card numbers.
- Relevance threshold 0.35 plus keyword re-rank, empty result -> refuse to answer.
- Voice never replaces text flow; transcript must be confirmed.

## 14. Challenges and debugging
Visible in code: small-model JSON unreliability (fence/think stripping, fallback router); "ticket mid-conversation" routing (`active_ticket` forces route=ticket); invalid email/description/category re-asks by clearing the field. Actual debugging narrative and what failed in real runs [CONFIRM]; none is committed.

## 15. What was actually implemented
All components above exist as code, plus unit tests that use fakes (`tests/test_workflow.py`, `test_rag.py`, `test_voice.py`, `test_api.py`, `test_pipeline.py`, `test_tickets.py`, `test_session.py`). Whether they pass: not verified.

## 16. What was only planned / claimed but absent
Persistent ticket storage (PostgreSQL mentioned in README only); auth; the README's demo video, ZIP, Drive checklist items (process, not code).

## 17. Current limitations
- Tickets, sessions and history are in memory, single process, unbounded growth, no expiry.
- Retrieval query is just the latest message, so follow-ups ("what about express?") lose context.
- `_keyword_overlap` uses substring matching, which over-matches short tokens; re-ranking by overlap before score may demote better semantic hits.
- Ticket ID is `len(tickets)+1`, not safe under concurrency.
- Email-failure detection matches substrings of the pydantic error text.
- Routing and extraction depend on a 3B model; extraction is unverified against user text (the model could mis-extract).
- Config mismatches: `API_PORT` default 8000 in `config.py` vs README run command on 8001; `.env.example` ends with `API_BASE_URL=http://127.0.0.1:800033` (invalid port, and it overrides the earlier line if loaded); `.env.example` lacks `RAG_RELEVANCE_THRESHOLD` in its first block (appears duplicated).
- Google STT sends audio to an external service; Edge TTS is unofficial; WAV only; no streaming.
- Knowledge base is four tiny files (about 3 lines each); no evaluation set.
- No auth/rate limiting; `get_ticket` returns any ticket by ID.

## 18. What should be improved
Persist tickets/sessions (PostgreSQL via SQLAlchemy as the README hints, or SQLite); atomic ID sequence; query rewriting with history; hybrid retrieval with proper tokenisation; structured output / function-calling instead of JSON scraping; auth and PII handling; retrieval and routing evaluation set; fix `.env.example`; CI running `pytest`; observability.

## 19. Interview questions
1. Walk me through one `/chat` request.
2. How does RAG ingestion avoid duplicates on restart?
3. How do you stop the agent answering from nothing?
4. How is a ticket created exactly once?
5. Why LangGraph rather than a plain function?
6. What if the LLM returns invalid JSON?
7. How do you defend against prompt injection from KB text or users?
8. What is stored where, and what is lost on restart?
9. How does voice integrate without changing the agent?
10. How would you scale this?
11. What did you write versus the supplied starter?
12. How would you evaluate answer quality?

## 20. Suggested answers based on the actual code
1. "`ChatRequest` validates; `SupportPipeline.process` loads the session and calls the graph: `retrieve` -> `decide` -> `answer` or `ticket`; the pipeline verifies the ticket ID and returns `ChatResponse` with de-duplicated source filenames."
2. "`_document_id` is sha256 of source and chunk text; `initialize` calls `store.get(ids=...)` and adds only missing ones. A tested idempotency case exists in `test_rag.py`; I did not run it."
3. "`search` drops results under `rag_relevance_threshold` (0.35); the `answer` node returns a fixed refusal when no chunks remain; the system prompt restricts to supplied context. The threshold value is a default I have not tuned or evaluated [CONFIRM]."
4. "Two guards: `collect_or_create` returns the existing ticket if `session.ticket_id` is set, and `TicketRepository.create` returns the session's existing ticket. Both are in-process only."
5. "Explicit nodes with injected dependencies make routing and each branch independently testable (`test_workflow.py` builds the graph with fakes)."
6. "`_parse_agent_decision` strips think/fences and extracts the first balanced JSON object; on any exception `_fallback_route` picks a route by regex, and fields are then simply empty so the bot asks for them."
7. "The router prompt marks retrieved text as data and says rules cannot be changed by it; the system prompt forbids requesting secrets. These are prompt-level mitigations only, not a tested guarantee."
8. "Chroma on disk persists; tickets, sessions and history are dicts in memory and vanish on restart. The README's PostgreSQL mention has no code behind it."
9. "`/voice/transcribe` returns text only; Streamlit shows it editable and only the user's submit goes to `/chat`. TTS runs only when the speaker button is pressed and failure leaves the text intact."
10. "Move state to a DB, make ID generation atomic, run multiple workers, cache the embedder, use a hosted or batched LLM. None is implemented."
11. "Be precise: say which files are yours after checking [CONFIRM]; the repo's own comments point to supplied client/loader/embeddings/prompts and KB."
12. "Build labelled question sets for in-KB/out-of-KB/ticket intents, measure retrieval hit rate and routing accuracy; no such set exists in the repo."
