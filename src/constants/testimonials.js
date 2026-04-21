// src/constants/testimonials.js

export const testimonials = [
  {
    name: "Krish Naik",
    role: "Co-founder at iNeuron.ai",
    quote:
      "Mihir has been an exceptional learner and has performed remarkably well in the field of data science. From an implementation perspective, he has developed impressive AI use cases using open-source MLOps tools. I look forward to seeing him excel in this domain. Best of luck!",
    linkedin: "https://www.linkedin.com/in/naikkrish/",
  },
  {
    name: "Harsh Sinha",
    role: "Data Analyst at Amazon",
    quote:
      "I would recommend Mihir in the field of AI, Machine learning and data analytics. He helped me in one of the projects that showed his dedication and knowledge in the field. He would be a valuable employee, possessing strong skills in automation and scripting.",
    linkedin: "https://www.linkedin.com/in/kumarharsh32/",
  },
];

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");