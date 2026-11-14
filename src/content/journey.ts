import type { JourneyEvent } from "./types";

export const chapters = [
  { id: "beginning", title: "The beginning", blurb: "School, and the first line of Python." },
  { id: "university", title: "Entering university", blurb: "A degree in computer science and a first look at data." },
  { id: "exploration", title: "Technical exploration", blurb: "From coursework to things that run." },
  { id: "practice", title: "Internships and hackathons", blurb: "Working with real constraints and real deadlines." },
  { id: "research", title: "Research and current direction", blurb: "Building the depth that AI and data roles ask for." },
] as const;

/**
 * Chronological story. Every event is backed by the PRD, the resume, the supplied brief or repository history.
 * Dates the owner has not supplied stay null. Nothing here is inferred.
 */
export const journey: (JourneyEvent & { chapter: (typeof chapters)[number]["id"] })[] = [
  {
    id: "class-11-cs", chapter: "beginning", kind: "school", date: null, dateLabel: "Class 11",
    title: "Chose Computer Science and started Python",
    summary: "Picked Computer Science in Class 11 and began learning Python, which turned into a steady interest in programming and technology.",
  },
  {
    id: "school-project", chapter: "beginning", kind: "school", date: null, dateLabel: "School years, date to be added",
    title: "A school project, and a paper that goes with it",
    summary: "An early school project has an accompanying paper, described as an educator paper.",
    detail: ["The project name, the school, the date and the status of the paper have not been supplied, so none are stated here.", "This entry will be completed once those details are confirmed."],
    status: "to-confirm",
  },
  {
    id: "ncu-join", chapter: "university", kind: "university", date: "2023-08", dateLabel: "August 2023",
    title: "Joined The NorthCap University",
    summary: "Started a B.Tech in Computer Science and Engineering with a Data Science specialisation, in Gurugram.",
    detail: ["Expected graduation is May 2027.", "Early work was about getting comfortable with programming, mathematics, data science and machine learning."],
  },
  {
    id: "programmers-club", chapter: "university", kind: "leadership", date: "2024-08", dateLabel: "August 2024",
    title: "Management Head, Programmers' Club",
    summary: "Took on the management role of the university's technical club, a role that continues.",
  },
  {
    id: "cert-python-crash", chapter: "exploration", kind: "certification", date: "2025-03", dateLabel: "March 2025",
    title: "Crash Course on Python (Google)",
    summary: "Completed a structured Python course and earned a verifiable certificate.",
  },
  {
    id: "cert-summer-analytics", chapter: "exploration", kind: "certification", date: "2025-04", dateLabel: "April 2025",
    title: "Summer Analytics 2025 (IIT Guwahati)",
    summary: "Completed an analytics programme run by the Indian Institute of Technology, Guwahati. Assignments are in the Summer-analytics-2025 repository.",
  },
  {
    id: "ibm-prodesk", chapter: "practice", kind: "internship", date: "2025-06", dateLabel: "June to July 2025",
    title: "Two separate internships",
    summary: "A machine learning internship with IBM SkillsBuild (regression on an HR salary problem) and a remote backend internship with ProdeskIT (Django REST APIs, JWT, PostgreSQL). They ran in the same two months and are separate roles.",
    detail: ["IBM SkillsBuild: dataset exploration, cleaning, feature engineering and regression modelling in Python, pandas and scikit-learn.", "ProdeskIT: a blogging platform API with posts, comments, JWT authentication, role-based permissions and Postman testing."],
  },
  {
    id: "pose2post-start", chapter: "exploration", kind: "project", date: "2025-06", dateLabel: "June 2025 (first repository commit)",
    title: "Pose2Post begins as a team project",
    summary: "A college team project that explores AI help for preparing a photo post. Uttam built the NIMA aesthetic-scoring module.",
    projectSlug: "pose2post", photoId: "ppt-explain",
  },
  {
    id: "cert-ai-fundamentals", chapter: "exploration", kind: "certification", date: "2025-07", dateLabel: "July 2025",
    title: "AI Fundamentals (IBM)",
    summary: "Earned the IBM Artificial Intelligence Fundamentals badge.",
  },
  {
    id: "ibm-cert-run", chapter: "exploration", kind: "certification", date: "2025-08", dateLabel: "August to September 2025",
    title: "Four IBM deep learning and machine learning certificates",
    summary: "Machine Learning with Python, Introduction to Deep Learning with Keras, Deep Learning with Keras and TensorFlow, and Introduction to Neural Networks and PyTorch.",
    detail: ["The Keras course's final project became the aircraft damage classification and BLIP captioning project."],
  },
  {
    id: "technicia", chapter: "practice", kind: "hackathon", date: "2025-10", dateLabel: "15 to 17 October 2025",
    title: "Technicia, Mohali: Top 10",
    summary: "Presented Envital through a presentation round and a technical round, and reached the final. A Top 10 result, not a winner award.",
    projectSlug: "envital", photoId: "cu-mohali",
  },
  {
    id: "hack-up", chapter: "practice", kind: "hackathon", date: "2025-11", dateLabel: "1 to 2 November 2025",
    title: "Hack with Uttar Pradesh, Lucknow: Top 5 finalist",
    summary: "Took Envital through a technical round to the finale. Described as a Top 5 finalist until the exact position is verified.",
    projectSlug: "envital", photoId: "cu-lucknow",
  },
  {
    id: "javajamboree", chapter: "practice", kind: "hackathon", date: null, dateLabel: "Date to be added",
    title: "JavaJamboree Ideathon",
    summary: "Took part in the ideathon and received a participation certificate. No award or ranking.",
    photoId: "certificate-ncu", status: "to-confirm",
  },
  {
    id: "vision-projects", chapter: "research", kind: "project", date: "2026-03", dateLabel: "March 2026 (repository commit)",
    title: "Transfer learning and image captioning",
    summary: "Published the aircraft damage classifier (VGG16) with BLIP captioning, the final project of the IBM Keras course.",
    projectSlug: "aircraft-damage-blip",
  },
  {
    id: "csir-npl", chapter: "practice", kind: "internship", date: "2026-06", dateLabel: "June to July 2026",
    title: "CSIR-NPL, AI-enabled digital twin",
    summary: "Worked on persistence and uncertainty for the digital twin of an industrial induction motor. The solution was presented to DRDO authorities together with the project lead.",
    detail: ["InfluxDB, AWS IoT Core and Azure IoT Hub were investigated. They were not implemented.", "The presentation was made with the project lead, and this page does not claim credit for the project that followed."],
    projectSlug: "csir-npl-digital-twin", photoId: "dt-machine",
  },
  {
    id: "llm-agents", chapter: "research", kind: "project", date: "2026-09", dateLabel: "September 2026 (repository commits)",
    title: "Retrieval-augmented support agent and a rule-based disruption agent",
    summary: "Built a LangGraph support assistant with a Chroma knowledge base and a deterministic, auditable airline-disruption prototype.",
    projectSlug: "customer-support-ticket-agent",
  },
  {
    id: "agni-neuroq", chapter: "research", kind: "project", date: "2026-10", dateLabel: "October 2026 (repository commits)",
    title: "Agni-Pulse and NeuroQ",
    summary: "Signal processing and a FastAPI and PostgreSQL pipeline for Agni-Pulse, and the CT data pipeline for NeuroQ, which is under construction and will be published soon.",
    projectSlug: "agni-pulse",
  },
  {
    id: "present", chapter: "research", kind: "present", date: null, dateLabel: "Now",
    title: "Building the depth AI and data roles ask for",
    summary: "An undergraduate actively building the engineering depth required for AI/ML and data-focused roles, with graduation in May 2027.",
    photoId: "working",
  },
];
