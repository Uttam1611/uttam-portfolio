import type { RepoCollection } from "./types";

const U = "https://github.com/Uttam1611";

/**
 * Small repositories grouped by theme so near-identical work does not compete for attention.
 * Descriptions come from reading each repository's README, files and git history (Nov 2026).
 * Nothing here is a claim about quality beyond what the repository itself documents.
 */
export const collections: RepoCollection[] = [
  {
    id: "ml-notebooks",
    title: "Applied machine learning notebooks",
    cluster: "Machine Learning and Data Science",
    ranking: "Learning / exploratory work",
    roleTags: ["data-scientist", "ml-engineer"],
    summary:
      "Course and internship notebooks that apply standard supervised-learning workflows: cleaning, feature engineering, model fitting and evaluation. They show the fundamentals, not original research.",
    repos: [
      { name: "employee-salary-prediction", url: `${U}/employee-salary-prediction`, period: "Jul 2025", blurb: "Classification notebook on an employment dataset. The repository name says salary, but the notebook predicts whether income exceeds a threshold.", note: "README still contains unfilled result placeholders." },
      { name: "AUS-Weather-Prediction", url: `${U}/AUS-Weather-Prediction`, period: "Aug 2025", blurb: "Course final project predicting Australian weather outcomes from a public dataset." },
      { name: "league-match-predictor", url: `${U}/league-match-predictor`, period: "Sep 2025", blurb: "Course final project predicting League of Legends match outcomes." },
      { name: "waste-classifier-tl-ft", url: `${U}/waste-classifier-tl-ft`, period: "Sep 2025", blurb: "Transfer-learning and fine-tuning classifier for waste images, a course final project.", note: "README still contains unfilled result placeholders." },
      { name: "Summer-analytics-2025", url: `${U}/Summer-analytics-2025`, period: "Jun to Jul 2025", blurb: "Weekly assignments from the IIT Guwahati Summer Analytics 2025 programme, shared with other participants." },
    ],
  },
  {
    id: "django-backend",
    title: "Django backend practice",
    cluster: "Backend Engineering and API Development",
    ranking: "Supporting project",
    roleTags: ["backend-engineer"],
    summary:
      "A set of Django and Django REST Framework applications built in June and July 2025, around the ProdeskIT backend internship. They cover authentication, relational models, CRUD APIs and a blogging platform with comments.",
    repos: [
      { name: "realtime-blog-django", url: `${U}/realtime-blog-django`, period: "Jul 2025", blurb: "Blogging platform with accounts, posts and comments. The strongest of the group: it includes a test coverage report." },
      { name: "django-online-learning-platform", url: `${U}/django-online-learning-platform`, period: "Jul 2025", blurb: "Course platform backend." },
      { name: "django-realtime-chat", url: `${U}/django-realtime-chat`, period: "Jul 2025", blurb: "Chat application experiment using Django Channels with an in-memory channel layer." },
      { name: "django-ticket-booking-system", url: `${U}/django-ticket-booking-system`, period: "Jul 2025", blurb: "Ticket booking models and views. The README describes SQLite, while the settings file points to PostgreSQL." },
      { name: "django-recipe-app", url: `${U}/django-recipe-app`, period: "Jul 2025", blurb: "Recipe CRUD application." },
      { name: "django-contact-manager", url: `${U}/django-contact-manager`, period: "Jul 2025", blurb: "Contact manager CRUD application." },
      { name: "todo-django-smart", url: `${U}/todo-django-smart`, period: "Jul 2025", blurb: "To-do application." },
      { name: "weather-info-api", url: `${U}/weather-info-api`, period: "Jul 2025", blurb: "Weather information service consuming an external API." },
    ],
  },
  {
    id: "tools-and-experiments",
    title: "Small tools and experiments",
    cluster: "Machine Learning and Data Science",
    ranking: "Learning / exploratory work",
    roleTags: ["backend-engineer", "data-scientist"],
    summary: "Small utilities and one simulation-based prototype. Useful context for how Uttam builds, but not presented as flagship work.",
    repos: [
      { name: "epiwatch", url: `${U}/epiwatch`, period: "Mar 2026", blurb: "Outbreak-detection pipeline and dashboard that runs on simulated data only. It makes no claim about real surveillance." },
      { name: "ncu-calendar-sync", url: `${U}/ncu-calendar-sync`, period: "Nov 2026", blurb: "Script that syncs a university timetable into a calendar." },
      { name: "Image-uploader-file-renamer", url: `${U}/Image-uploader-file-renamer`, period: "Jul 2025", blurb: "Object-oriented Python uploader and renamer, with one commit from another contributor." },
    ],
  },
];
