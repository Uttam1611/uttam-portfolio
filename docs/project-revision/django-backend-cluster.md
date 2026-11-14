# Django backend practice cluster

Repos (all https://github.com/Uttam1611/...): `realtime-blog-django`, `django-online-learning-platform`, `django-realtime-chat`, `django-ticket-booking-system`, `django-recipe-app`, `django-contact-manager`, `todo-django-smart`, `weather-info-api`. Written around the ProdeskIT internship (Jun to Jul 2025). Strongest: `realtime-blog-django` (accounts, blog, tests, committed `htmlcov`). **Verified from settings files:** every repo configures PostgreSQL; `django-realtime-chat` uses `InMemoryChannelLayer`; several others declare `channels_redis` (Redis layer); `weather-info-api` lists `rest_framework`; `realtime-blog-django` has both an in-memory and a Redis layer entry and also commits `db.sqlite3`. The README of `django-ticket-booking-system` says SQLite, which disagrees with its settings. Treat these as practice projects.

## 1. Project overview

Eight small Django applications: blog with comments, learning platform, chat, ticket booking, recipes, contacts, to-do and a weather lookup API.

## 2. Problem statement

Practise the Django request cycle, ORM models, authentication and CRUD, plus an introduction to Channels (WebSockets).

## 3. Why the project was built

To build backend fundamentals during and after the ProdeskIT internship. [CONFIRM which repo mirrors internship work and which are separate practice.]

## 4. System architecture

Each is a standard Django project: apps with `models.py`, `views.py`, `urls.py`, templates or DRF serializers; Channels configured through `asgi.py` and a channel layer. [CONFIRM per repo by opening `asgi.py` and consumers.]

## 5. End-to-end execution flow

Browser or Postman request -> URL router -> view -> ORM -> PostgreSQL -> template or JSON. For chat or notifications: WebSocket -> consumer -> channel layer -> group broadcast.

## 6. Technologies and why they were selected

Django, Django REST Framework (weather-info-api), Channels with Redis or in-memory layers, PostgreSQL, `tests.py` per app. Choose in-memory layers only for single-process development; Redis for multiple workers.

## 7. Important source files

`<project>/settings.py`, `asgi.py`, each app's `models.py`, `views.py`, `tests.py`; `realtime-blog-django/blog/tests.py` and `accounts/tests.py`.

## 8. Main functions and modules

[CONFIRM] List models and views for the blog repo and write a sentence on each.

## 9. Data flow

Request -> view -> ORM -> database -> response; WebSocket -> consumer -> channel layer.

## 10. Model choices and reasoning (where applicable)

Not applicable.

## 11. Database design (where applicable)

PostgreSQL in settings for all repos. Learn the blog schema: users, posts, comments and their foreign keys. [CONFIRM migrations.]

## 12. APIs and contracts (where applicable)

`weather-info-api` uses DRF. For the blog and learning platform, check URL configs for JSON endpoints. [CONFIRM contracts.]

## 13. Important implementation decisions

Channels layer choice per repo; PostgreSQL even for small apps. Be ready to explain why the chat uses the in-memory layer.

## 14. Challenges and debugging

README versus settings mismatch (ticket booking); committed `db.sqlite3` and `htmlcov` in the blog repo. [CONFIRM other challenges.]

## 15. What was actually implemented

Working CRUD apps with models and tests (counts of tests: [CONFIRM by running locally]).

## 16. What was only planned

Production deployment is not documented.

## 17. Current limitations

Practice scale; secrets and database config are in settings (check for committed credentials before publishing); in-memory channel layers do not scale; documentation inconsistent in places.

## 18. What should be improved

Move secrets to environment variables; remove committed `db.sqlite3` and coverage output; align READMEs with settings; add API docs.

## 19. Interview questions

- Explain the Django request-response cycle.
- What is a channel layer and why Redis?
- Why would in-memory be wrong in production?
- How do you secure endpoints (JWT, permissions)?
- What did you test in the blog app?
- How would you deploy it?

## 20. Suggested answers based on the actual code

Answer from the files above. Say plainly these are practice apps. For ProdeskIT specifics (JWT, RBAC, Postman) use the internship record, and only claim what you personally did. [CONFIRM]
