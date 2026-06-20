import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawPath = path.join(__dirname, '../src/data', 'portfolio-raw.json');
const jsonPath = path.join(__dirname, '../api/data', 'portfolio.json');

console.log('--- Syncing Raw Unified Portfolio JSON to Backend LLM ---');

try {
  if (!fs.existsSync(rawPath)) {
    throw new Error(`Raw portfolio data file not found at ${rawPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

  const {
    homeData,
    aboutMeData,
    contactConfig,
    educationList,
    experiences,
    certifications,
    skills,
    allProjects,
  } = rawData;

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
    skills: skills,
    projects: allProjects.map((p) => ({
      title: p.title,
      description: p.description,
      stack: p.stack ?? [],
      github: p.github ?? '',
      demo: p.demo ?? '',
    })),
  };

  fs.writeFileSync(jsonPath, JSON.stringify(portfolio, null, 4));

  console.log(`✅ Synced and compressed all sections from raw unified JSON:`);
  console.log(`   about, contact, education (${portfolio.education.length}), experience (${portfolio.experience.length}), certifications (${portfolio.certifications.length}), skills (${portfolio.skills.length} categories), projects (${portfolio.projects.length})`);
  console.log('');
} catch (error) {
  console.error('❌ Failed to sync portfolio data:', error.message);
  process.exit(1);
}
