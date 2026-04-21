import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { allProjects } from '../src/constants/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, 'data', 'portfolio.json');

// Read existing JSON
const rawData = fs.readFileSync(jsonPath, 'utf-8');
const portfolio = JSON.parse(rawData);

console.log(`Currently backend has ${portfolio.projects.length} projects.`);
console.log(`Frontend has ${allProjects.length} projects.`);

// Sync frontend to backend
portfolio.projects = allProjects;

// Save JSON
fs.writeFileSync(jsonPath, JSON.stringify(portfolio, null, 4));

console.log('Successfully synced projects! Backend now has', portfolio.projects.length, 'projects.');
