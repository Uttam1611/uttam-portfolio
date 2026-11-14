import type { Achievement, Certification, Education } from "./types";

export const education: Education[] = [
  {
    id: "ncu-btech",
    institution: "The NorthCap University",
    location: "Gurugram",
    degree: "B.Tech, Computer Science and Engineering",
    specialisation: "Data Science",
    startDate: "2023-08",
    endDate: "2027-05",
    score: "8.52",
    scoreScale: "10",
    scoreLabel: "CGPA",
  },
  {
    id: "class-xii",
    institution: "Kendriya Vidyalaya, Class XII",
    location: null,
    degree: "Senior secondary",
    specialisation: null,
    startDate: null,
    endDate: "2023-01",
    score: "84.90",
    scoreScale: "100",
    scoreLabel: "Percentage",
  },
  {
    id: "class-x",
    institution: "Kendriya Vidyalaya, Class X",
    location: null,
    degree: "Secondary",
    specialisation: null,
    startDate: null,
    endDate: "2021-01",
    score: "93.00",
    scoreScale: "100",
    scoreLabel: "Percentage",
  },
];

/** Class X and XII are recorded by year only; month precision above is a placeholder and never displayed. */
export const schoolYears: Record<string, string> = { "class-xii": "2023", "class-x": "2021" };

export const certifications: Certification[] = [
  { id: "nn-pytorch", name: "Introduction to Neural Networks and PyTorch", issuingOrganisation: "IBM", issueDate: "2025-09", credentialId: "B8Y429JG0M9X", credentialUrl: "https://www.coursera.org/account/accomplishments/verify/B8Y429JG0M9X", platform: "Coursera", skills: ["Machine Learning", "Deep Learning"] },
  { id: "keras-tensorflow", name: "Deep Learning with Keras and TensorFlow", issuingOrganisation: "IBM", issueDate: "2025-09", credentialId: "2JRPFMNXO0B2", credentialUrl: "https://www.coursera.org/account/accomplishments/verify/2JRPFMNXO0B2", platform: "Coursera", skills: ["Deep Learning", "Transfer Learning"], skillsNote: "The certificate lists additional skills. Open the verification page to see them all." },
  { id: "keras-intro", name: "Introduction to Deep Learning & Neural Networks with Keras", issuingOrganisation: "IBM", issueDate: "2025-08", credentialId: "LUP6PFT1XF4R", credentialUrl: "https://www.coursera.org/account/accomplishments/verify/LUP6PFT1XF4R", platform: "Coursera", skills: ["Deep Learning", "Artificial Intelligence"], skillsNote: "The certificate lists additional skills. Open the verification page to see them all." },
  { id: "ml-python", name: "Machine Learning with Python", issuingOrganisation: "IBM", issueDate: "2025-08", credentialId: "MKAAMBNKGNZB", credentialUrl: "https://www.coursera.org/account/accomplishments/verify/MKAAMBNKGNZB", platform: "Coursera", skills: ["Machine Learning", "Artificial Intelligence"], skillsNote: "The certificate lists additional skills. Open the verification page to see them all." },
  { id: "ai-fundamentals", name: "Artificial Intelligence Fundamentals", issuingOrganisation: "IBM", issueDate: "2025-07", credentialId: null, credentialUrl: "https://www.credly.com/badges/0cd22e17-d016-4e8d-9cb4-e71a376026d5/linked_in_profile", platform: "Credly", skills: ["Python", "Pandas"], skillsNote: "The badge lists additional skills. Open the Credly page to see them all." },
  { id: "summer-analytics-2025", name: "Summer Analytics 2025", issuingOrganisation: "Indian Institute of Technology, Guwahati", issueDate: "2025-04", credentialId: "96f9a74f-4961-47a8-9fcc-4a34fc54f09a", credentialUrl: "https://certificate.givemycertificate.com/c/96f9a74f-4961-47a8-9fcc-4a34fc54f09a", platform: "GiveMyCertificate", skills: ["Pandas", "Python"], skillsNote: "The certificate lists additional skills. Open the verification page to see them all." },
  { id: "python-crash-course", name: "Crash Course on Python", issuingOrganisation: "Google", issueDate: "2025-03", credentialId: "PS4PSKMN9J43", credentialUrl: "https://www.coursera.org/account/accomplishments/verify/PS4PSKMN9J43", platform: "Coursera", skills: ["Python"], skillsNote: "Python is the skill supplied for this page. The certificate may list more." },
];

export const achievements: Achievement[] = [
  {
    id: "technicia-top10",
    kind: "Hackathon",
    title: "Technicia, Mohali: Top 10",
    description: "15 to 17 October 2025. Envital passed the presentation and technical rounds and reached the final, placing in the Top 10. Not a winner award.",
    relatedProject: "envital",
  },
  {
    id: "hack-up-top5",
    kind: "Hackathon",
    title: "Hack with Uttar Pradesh, Lucknow: Top 5 finalist",
    description: "1 to 2 November 2025. Envital reached the finale. The user recalls fifth place; the exact position is unverified, so it is stated as Top 5 finalist.",
    relatedProject: "envital",
  },
  {
    id: "javajamboree",
    kind: "Hackathon",
    title: "JavaJamboree Ideathon: participant",
    description: "A participation certificate exists. No award or ranking was received.",
  },
  {
    id: "sih-2026",
    kind: "Hackathon",
    title: "Smart India Hackathon 2026",
    description: "NeuroQ, a hybrid quantum-classical project for intracranial hemorrhage detection, is associated with this hackathon. No placement or award is recorded.",
    relatedProject: "neuroq",
  },
  {
    id: "programmers-club-head",
    kind: "Leadership",
    title: "Management Head, Programmers' Club",
    description: "Leading the technical club at The NorthCap University since August 2024.",
  },
];
