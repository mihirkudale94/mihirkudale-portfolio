import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { homeData } from '../src/constants/home.js';
import { aboutMeData } from '../src/constants/aboutme.js';
import { contactConfig } from '../src/constants/contacts.js';
import { educationList } from '../src/constants/education.js';
import { experiences } from '../src/constants/workexperience.js';
import { certifications } from '../src/constants/certifications.js';
import { categories } from '../src/constants/skills.js';
import { allProjects } from '../src/constants/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, '../api/data', 'portfolio.json');

console.log('--- Syncing Frontend Data to Backend LLM ---');

try {
  const portfolio = {
    about: {
      name: homeData.name,
      title: aboutMeData.intro.title,
      focus: aboutMeData.intro.focus,
      description: aboutMeData.intro.description,
      credentials: homeData.badges.join(' • '),
      location: contactConfig.locationText,
      availability: contactConfig.availabilityText,
      roles: homeData.roles,
      badges: homeData.badges,
    },
    contact: {
      email: contactConfig.socials.email.replace('mailto:', ''),
      linkedin: contactConfig.socials.linkedin,
      github: contactConfig.socials.github,
      phone: 'Not provided publicly. Please reach out via email or LinkedIn.',
    },
    education: educationList.map((e) => ({
      degree: e.degree,
      institution: e.institution,
      university: e.university ?? null,
      location: e.location,
      duration: e.duration,
    })),
    experience: experiences.map((exp) => ({
      company: exp.company,
      location: exp.location,
      roles: exp.roles.map((r) => ({
        role: r.role,
        display: r.display,
        tech: r.tech ?? [],
      })),
    })),
    certifications: certifications.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      link: c.link ?? null,
    })),
    skills: categories,
    projects: allProjects.map((p) => ({
      title: p.title,
      description: p.description,
      stack: p.stack ?? [],
      github: p.github ?? '',
      demo: p.demo ?? '',
    })),
  };

  fs.writeFileSync(jsonPath, JSON.stringify(portfolio, null, 4));

  console.log(`✅ Synced all sections from frontend constants:`);
  console.log(`   about, contact, education (${portfolio.education.length}), experience (${portfolio.experience.length}), certifications (${portfolio.certifications.length}), skills (${portfolio.skills.length} categories), projects (${portfolio.projects.length})`);
  console.log('');
} catch (error) {
  console.error('❌ Failed to sync portfolio data:', error.message);
  process.exit(1);
}
