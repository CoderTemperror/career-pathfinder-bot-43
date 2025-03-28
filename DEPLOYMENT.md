
# Deploying to GitHub Pages

Since we can't modify `package.json` directly in this environment, follow these steps to deploy your application to GitHub Pages:

## Prerequisites

- You need access to the repository on GitHub
- Node.js installed on your computer

## Deployment Steps

1. Make sure your `vite.config.ts` has the correct base URL:
   ```js
   base: '/career-pathfinder-bot/', // Replace with your actual repository name
   ```

2. Run the deployment script:
   ```bash
   node deploy.js
   ```

3. If prompted, enter your GitHub repository URL.

4. The script will:
   - Build your project
   - Create necessary GitHub Pages files
   - Push to the gh-pages branch

5. After successful deployment, your site will be available at:
   `https://your-username.github.io/career-pathfinder-bot/`

## Manual Deployment

If the script fails, you can manually deploy:

1. Build the project:
   ```bash
   npm run build
   ```

2. Navigate to the dist folder:
   ```bash
   cd dist
   ```

3. Initialize git if needed:
   ```bash
   git init
   ```

4. Add all files:
   ```bash
   git add -A
   ```

5. Commit changes:
   ```bash
   git commit -m "Deploy to GitHub Pages"
   ```

6. Add your remote (replace with your info):
   ```bash
   git remote add origin https://github.com/your-username/career-pathfinder-bot.git
   ```

7. Push to gh-pages branch:
   ```bash
   git push -f origin HEAD:gh-pages
   ```

## Troubleshooting

- If you see 404 errors after deployment, make sure:
  1. Your repository is set to publish from the gh-pages branch
  2. The base URL in vite.config.ts matches your repository name exactly
  3. You've waited a few minutes for GitHub Pages to build
