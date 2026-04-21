// src/constants/contacts.js

// Email split to prevent regex-based harvesting by spam bots
const _eu = 'mihirkudale94';
const _ed = 'gmail.com';
const _email = `${_eu}@${_ed}`;

export const contactConfig = {
  heading: "Let’s Work Together",
  description:
    "Looking for a data analyst, data scientist, data engineer, or AI/ML developer who delivers results? Let’s connect via email or your preferred platform.",
  ctaLink:
    `mailto:${_email}?subject=Opportunity%20to%20Collaborate&body=Hi%20Mihir%2C%0A%0AI came across your portfolio and wanted to connect regarding...`,
  ctaText: "Get in Touch",

  locationTitle: "Location",
  locationText: "Kothrud, Pune, Maharashtra, India",
  availabilityText:
    "Available for on-site, remote, and freelance roles globally.",

  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.1740533123913!2d73.80756411435893!3d18.507445387414057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bcc021c2aef7%3A0x5b2a57d6f5be514!2sKothrud%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1717171717171!5m2!1sen!2sin",

  socials: {
    github: "https://github.com/mihirkudale",
    linkedin: "https://www.linkedin.com/in/mihirkudale/",
    email: `mailto:${_email}`,
  },

  footer: {
    name: "Mihir Kudale",
    text: "All rights reserved. © 2026. Designed by",
  },
};