
// Simple script to prepare and deploy to GitHub Pages
// Run with: node deploy.js

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}🚀 Starting GitHub Pages deployment process...${colors.reset}`);

try {
  // Step 1: Build the project
  console.log(`${colors.yellow}📦 Building the project...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Create a .nojekyll file to prevent Jekyll processing
  const distDir = path.resolve(__dirname, 'dist');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  
  // Step 3: Initialize git in the dist folder if it doesn't exist
  console.log(`${colors.yellow}🔧 Preparing the dist folder for deployment...${colors.reset}`);
  
  try {
    process.chdir(distDir);
    
    // Check if git is already initialized
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      console.log(`${colors.green}✓ Git is already initialized in the dist folder${colors.reset}`);
    } catch (e) {
      console.log(`${colors.yellow}🔧 Initializing git in the dist folder...${colors.reset}`);
      execSync('git init', { stdio: 'inherit' });
    }
    
    // Add all files to git
    execSync('git add -A', { stdio: 'inherit' });
    
    // Commit changes
    console.log(`${colors.yellow}📝 Committing changes...${colors.reset}`);
    execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
    
    // Push to the gh-pages branch
    console.log(`${colors.yellow}🚀 Pushing to gh-pages branch...${colors.reset}`);
    
    // Check if remote exists
    let remoteExists = false;
    try {
      execSync('git config --get remote.origin.url', { stdio: 'ignore' });
      remoteExists = true;
    } catch (e) {
      // Remote doesn't exist
    }
    
    const repoUrl = process.env.GITHUB_REPOSITORY_URL || 
      // If no env variable is set, prompt the user
      `https://github.com/your-username/career-pathfinder-bot.git`;
    
    if (!remoteExists) {
      console.log(`${colors.yellow}🔗 Adding GitHub remote...${colors.reset}`);
      execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
    }
    
    // Force push to gh-pages branch
    try {
      execSync('git push -f origin HEAD:gh-pages', { stdio: 'inherit' });
      console.log(`${colors.green}✅ Successfully deployed to GitHub Pages!${colors.reset}`);
    } catch (e) {
      console.error(`${colors.red}❌ Error pushing to GitHub Pages: ${e.message}${colors.reset}`);
      console.log(`${colors.yellow}💡 You might need to manually set your GitHub repository:${colors.reset}`);
      console.log(`${colors.blue}1. Go to the dist folder: cd dist${colors.reset}`);
      console.log(`${colors.blue}2. Set your remote: git remote set-url origin https://github.com/your-username/career-pathfinder-bot.git${colors.reset}`);
      console.log(`${colors.blue}3. Push again: git push -f origin HEAD:gh-pages${colors.reset}`);
    }
  } finally {
    // Change back to the original directory
    process.chdir(__dirname);
  }
  
  console.log(`${colors.green}✨ Deployment process completed!${colors.reset}`);
  console.log(`${colors.blue}🌐 Your site should be available at: https://your-username.github.io/career-pathfinder-bot/${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}❌ Deployment failed: ${error.message}${colors.reset}`);
  process.exit(1);
}
