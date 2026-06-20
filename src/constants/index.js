import portfolioRaw from '../data/portfolio-raw.json';

export const homeData = portfolioRaw.homeData;
export const aboutMeData = portfolioRaw.aboutMeData;
export const contactConfig = portfolioRaw.contactConfig;
export const educationList = portfolioRaw.educationList;
export const experiences = portfolioRaw.experiences;
export const certifications = portfolioRaw.certifications;
export const categories = portfolioRaw.skills;
export const allProjects = portfolioRaw.allProjects;
export const testimonials = portfolioRaw.testimonials;
export const chatbotConfig = portfolioRaw.chatbotConfig;

export const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
};
