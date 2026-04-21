import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// We must use relative paths to reach the React source files from the /api folder
import { categories } from '../src/constants/skills.js';
import { allProjects } from '../src/constants/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'data', 'portfolio.json');

console.log('--- Syncing Frontend Data to Backend LLM ---');

try {
    // Read existing JSON
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const portfolio = JSON.parse(rawData);

    // Sync Skills
    console.log(`- Skills: Backend had ${portfolio.skills.length} categories, Frontend has ${categories.length} categories.`);
    portfolio.skills = categories;

    // Sync Projects
    console.log(`- Projects: Backend had ${portfolio.projects.length} projects, Frontend has ${allProjects.length} projects.`);
    portfolio.projects = allProjects;

    // Save JSON
    fs.writeFileSync(jsonPath, JSON.stringify(portfolio, null, 4));

    console.log('✅ Successfully synced frontend data to backend portfolio.json!\n');
} catch (error) {
    console.error('❌ Failed to sync portfolio data:', error.message);
    process.exit(1);
}
