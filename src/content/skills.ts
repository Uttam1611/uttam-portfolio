import type { EvidenceLevel, Skill, SkillCategory } from "./types";

export const skillCategories: SkillCategory[] = [
  "Programming and Data Manipulation",
  "Data Science and Analytics",
  "Machine Learning and Deep Learning",
  "AI Engineering and Generative AI",
  "Data Engineering and Backend Systems",
  "Specialized Technical Areas",
];

export const evidenceLevels: { id: EvidenceLevel; label: string; definition: string }[] = [
  { id: "demonstrated", label: "Demonstrated", definition: "Backed by an implementation, repository or substantial deliverable." },
  { id: "working", label: "Working knowledge", definition: "Used in coursework, projects or practical exercises. Depth may be limited." },
  { id: "learning", label: "Currently learning", definition: "Being studied now." },
  { id: "research", label: "Research exposure", definition: "Explored through research or investigation. Not claimed as implemented." },
];

/**
 * The evidence level is a classification of what the portfolio can show,
 * not a proficiency score. It is a self-assessment until each entry links to a repository.
 */
export const skills: Skill[] = [
  // Programming and Data Manipulation
  { id: "python", name: "Python", category: "Programming and Data Manipulation", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse", "customer-support-ticket-agent", "ainos-adr", "csir-npl-digital-twin"], relatedExperiences: ["prodeskit"], evidenceDescription: "Backends, signal processing and agent workflows across the repositories, and Django work at ProdeskIT." },
  { id: "opencv", name: "OpenCV", category: "Programming and Data Manipulation", evidenceLevel: "demonstrated", relatedProjects: ["pose2post"], relatedExperiences: [], evidenceDescription: "Image quality assessment module in Pose2Post, reviewed in code." },
  { id: "git", name: "Git", category: "Programming and Data Manipulation", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["prodeskit"], evidenceDescription: "Git-based collaboration during the ProdeskIT internship." },
  { id: "dicom", name: "DICOM, Hounsfield units and CT windowing", category: "Programming and Data Manipulation", evidenceLevel: "working", relatedProjects: ["neuroq"], relatedExperiences: [], evidenceDescription: "Documented preprocessing workflow in NeuroQ." },

  // Data Science and Analytics
  { id: "cleaning-fe", name: "Data cleaning and feature engineering", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["ibm-skillsbuild"], evidenceDescription: "IBM SkillsBuild internship work." },
  { id: "evaluation", name: "Model evaluation and benchmarking", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: ["neuroq"], relatedExperiences: ["ibm-skillsbuild"], evidenceDescription: "Evaluation at IBM SkillsBuild and benchmarking step in NeuroQ." },
  { id: "leakage-safe", name: "Patient-level leakage-safe splitting", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: ["neuroq"], relatedExperiences: [], evidenceDescription: "Part of the NeuroQ dataset workflow." },

  // Machine Learning and Deep Learning
  { id: "cnn", name: "Convolutional neural networks", category: "Machine Learning and Deep Learning", evidenceLevel: "working", relatedProjects: ["neuroq"], relatedExperiences: [], evidenceDescription: "CNN feature extraction in NeuroQ." },
  { id: "keras", name: "Neural networks with Keras and TensorFlow", category: "Machine Learning and Deep Learning", evidenceLevel: "demonstrated", relatedProjects: ["aircraft-damage-blip", "pose2post"], relatedExperiences: [], evidenceDescription: "VGG16 transfer-learning classifier in the IBM / Coursera final project, and the NIMA model in PhotoPost." },
  { id: "nima", name: "NIMA aesthetic scoring", category: "Machine Learning and Deep Learning", evidenceLevel: "demonstrated", relatedProjects: ["pose2post"], relatedExperiences: [], evidenceDescription: "Training and inference components in Pose2Post, reviewed in code." },

  // AI Engineering and Generative AI
  { id: "clip", name: "CLIP-based recommendation and ranking", category: "AI Engineering and Generative AI", evidenceLevel: "demonstrated", relatedProjects: ["pose2post"], relatedExperiences: [], evidenceDescription: "Pose recommendation and caption ranking in Pose2Post, reviewed in code." },
  { id: "blip", name: "BLIP image captioning", category: "AI Engineering and Generative AI", evidenceLevel: "demonstrated", relatedProjects: ["pose2post", "aircraft-damage-blip"], relatedExperiences: [], evidenceDescription: "Captioning module in PhotoPost and the second half of the aircraft damage project." },
  { id: "llm-api", name: "LLM API integration", category: "AI Engineering and Generative AI", evidenceLevel: "demonstrated", relatedProjects: ["pose2post"], relatedExperiences: [], evidenceDescription: "Caption candidates and song recommendation in Pose2Post, reviewed in code." },

  // Data Engineering and Backend Systems
  { id: "fastapi", name: "FastAPI", category: "Data Engineering and Backend Systems", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse", "customer-support-ticket-agent", "csir-npl-digital-twin"], relatedExperiences: [], evidenceDescription: "Agni-Pulse signal service, the support agent API, and the CSIR-NPL inference server extension." },
  { id: "drf", name: "Django REST Framework", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["prodeskit"], evidenceDescription: "Blogging platform API during the ProdeskIT internship." },
  { id: "jwt-rbac", name: "JWT authentication and role-based permissions", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: ["agni-pulse"], relatedExperiences: ["prodeskit"], evidenceDescription: "ProdeskIT internship, and per-user token and JWT authentication in Agni-Pulse." },
  { id: "postgres", name: "PostgreSQL schemas and migrations", category: "Data Engineering and Backend Systems", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse", "csir-npl-digital-twin"], relatedExperiences: ["prodeskit", "csir-npl"], evidenceDescription: "Versioned migrations and row-level security in Agni-Pulse, verified on local PostgreSQL 16 per its repository. Storage design at CSIR-NPL and schema work at ProdeskIT." },
  { id: "telemetry-pipelines", name: "Telemetry data pipelines", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: ["csir-npl-digital-twin"], relatedExperiences: ["csir-npl"], evidenceDescription: "CSIR-NPL internship." },
  { id: "api-testing", name: "API testing with Postman", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: ["agni-pulse"], relatedExperiences: ["prodeskit"], evidenceDescription: "ProdeskIT internship, and per-user token and JWT authentication in Agni-Pulse." },

  // Added from the GitHub repositories
  { id: "numpy-scipy", name: "NumPy and SciPy for signal analysis", category: "Data Science and Analytics", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse"], relatedExperiences: [], evidenceDescription: "Band-pass filtering, derivatives and peak detection in the Agni-Pulse DSP engine." },
  { id: "rag", name: "Retrieval-augmented generation with LangChain, LangGraph and Chroma", category: "AI Engineering and Generative AI", evidenceLevel: "demonstrated", relatedProjects: ["customer-support-ticket-agent"], relatedExperiences: [], evidenceDescription: "Knowledge-base assistant with a relevance threshold and a ticketing workflow. Quality is not yet evaluated." },
  { id: "rules-audit", name: "Deterministic policy engines with audit logging", category: "Data Engineering and Backend Systems", evidenceLevel: "demonstrated", relatedProjects: ["ainos-adr"], relatedExperiences: [], evidenceDescription: "Rule-based resolution agent with authority limits, safety tests and a JSONL audit trail." },
  { id: "testing", name: "Automated testing with pytest and unittest", category: "Data Engineering and Backend Systems", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse", "customer-support-ticket-agent", "ainos-adr"], relatedExperiences: [], evidenceDescription: "Test suites in three repositories. Counts are as reported in their READMEs." },
  { id: "docker", name: "Docker and Docker Compose", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: ["agni-pulse"], relatedExperiences: [], evidenceDescription: "Compose setup running PostgreSQL and the API for Agni-Pulse." },
  { id: "flutter", name: "Flutter and Android Camera2 development", category: "Specialized Technical Areas", evidenceLevel: "working", relatedProjects: ["agni-pulse"], relatedExperiences: [], evidenceDescription: "App and native plugin written for Agni-Pulse. The repository says the current code has not been compiled in its build environment." },
  { id: "uncertainty-calc", name: "Measurement uncertainty (Type A, Type B, combined)", category: "Specialized Technical Areas", evidenceLevel: "working", relatedProjects: ["csir-npl-digital-twin"], relatedExperiences: ["csir-npl"], evidenceDescription: "Implemented in the CSIR-NPL extension. End-to-end validation is not complete." },

  // Listed on the resume without a linked project. Classified as working knowledge until evidence is linked.
  { id: "sql", name: "SQL", category: "Programming and Data Manipulation", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["prodeskit"], evidenceDescription: "Listed on the resume. Database work at ProdeskIT and CSIR-NPL." },
  { id: "pandas", name: "Pandas and exploratory data analysis", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["ibm-skillsbuild"], evidenceDescription: "Listed on the resume. Exploratory analysis in the IBM SkillsBuild salary analysis." },
  { id: "sklearn", name: "scikit-learn: regression and classification", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: [], relatedExperiences: ["ibm-skillsbuild"], evidenceDescription: "Regression models for salary analysis at IBM SkillsBuild. No repository is linked yet." },
  { id: "pytorch", name: "PyTorch", category: "Machine Learning and Deep Learning", evidenceLevel: "demonstrated", relatedProjects: ["pose2post", "aircraft-damage-blip"], relatedExperiences: [], evidenceDescription: "BLIP captioning in PhotoPost and in the aircraft damage project, per the repositories." },
  { id: "bi", name: "Tableau and Power BI", category: "Data Science and Analytics", evidenceLevel: "working", relatedProjects: [], relatedExperiences: [], evidenceDescription: "Listed on the resume. No project is linked to it on this site yet." },
  { id: "bigdata-cloud", name: "PySpark, AWS and MongoDB", category: "Data Engineering and Backend Systems", evidenceLevel: "working", relatedProjects: [], relatedExperiences: [], evidenceDescription: "Listed on the resume. No project is linked to them on this site yet." },
  { id: "cs-core", name: "Core computer science: DSA, OOP, DBMS, OS, networks, SDLC", category: "Programming and Data Manipulation", evidenceLevel: "working", relatedProjects: [], relatedExperiences: [], evidenceDescription: "Degree coursework, listed on the resume." },
  { id: "sap", name: "SAP and ABAP", category: "Specialized Technical Areas", evidenceLevel: "working", relatedProjects: [], relatedExperiences: [], evidenceDescription: "Listed on the resume. No project is linked to it on this site yet." },

  // Specialized Technical Areas
  { id: "signal-processing", name: "PPG and APG signal processing", category: "Specialized Technical Areas", evidenceLevel: "demonstrated", relatedProjects: ["agni-pulse"], relatedExperiences: [], evidenceDescription: "Filtering, beat detection, APG features, RMSSD and signal quality in Agni-Pulse. Validated on synthetic signals only, and not clinically validated." },
  { id: "iot-twin", name: "Industrial IoT and digital twins", category: "Specialized Technical Areas", evidenceLevel: "working", relatedProjects: ["csir-npl-digital-twin"], relatedExperiences: ["csir-npl"], evidenceDescription: "CSIR-NPL internship." },
  { id: "predictive-maintenance", name: "Predictive maintenance, anomaly detection and RUL estimation", category: "Specialized Technical Areas", evidenceLevel: "research", relatedProjects: ["csir-npl-digital-twin"], relatedExperiences: ["csir-npl"], evidenceDescription: "Model exploration during the CSIR-NPL internship." },
  { id: "uncertainty", name: "Uncertainty-aware AI", category: "Specialized Technical Areas", evidenceLevel: "research", relatedProjects: ["csir-npl-digital-twin"], relatedExperiences: ["csir-npl"], evidenceDescription: "Monte Carlo Dropout and Bayesian methods were investigated during the CSIR-NPL internship. Not claimed as implemented." },
  { id: "qml", name: "Hybrid quantum-classical machine learning", category: "Specialized Technical Areas", evidenceLevel: "research", relatedProjects: ["neuroq"], relatedExperiences: [], evidenceDescription: "NeuroQ research direction." },
];
