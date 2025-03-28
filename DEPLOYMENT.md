
# Deploying to GitHub Pages

This project is set up to be easily deployed to GitHub Pages using a custom deployment script.

## Prerequisites

- You need a GitHub repository for this project
- Node.js installed on your computer (v14 or higher recommended)
- Git installed and configured

## Deployment Steps

### 1. Update Your Repository URL

First, make sure the `base` property in `vite.config.ts` matches your GitHub repository name:

```js
base: '/career-pathfinder-bot/', // Replace with your actual repository name
```

For example, if your repository is named `my-awesome-app`, change it to:

```js
base: '/my-awesome-app/',
```

### 2. Run the Deployment Script

Run the deployment script from your project directory:

```bash
node deploy.js
```

This script will:
- Build your project
- Create necessary GitHub Pages files
- Initialize git in the dist folder if needed
- Push to the gh-pages branch of your repository

### 3. Check GitHub Settings

After successful deployment:
1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Make sure the source is set to "Deploy from a branch"
4. Select the "gh-pages" branch and "/ (root)" folder
5. Click Save

Your site will be available at:
`https://your-username.github.io/your-repo-name/`

## Troubleshooting

### Script Fails with ES Module Error

If you see "require is not defined in ES module scope," make sure you're using the latest version of the deploy.js script which uses ES module syntax.

### Authentication Issues

If you encounter git authentication issues:

1. Make sure you have the proper permissions to push to the repository
2. Consider using a personal access token if you're not already
3. Set your git credentials using:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 404 Errors After Deployment

If you see 404 errors after deployment:
1. Double-check that the `base` URL in `vite.config.ts` exactly matches your repository name
2. Ensure GitHub Pages is enabled and set to deploy from the gh-pages branch
3. Wait a few minutes - GitHub Pages can take some time to build and deploy

### Manual Deployment

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
   git remote add origin https://github.com/your-username/your-repo-name.git
   ```

7. Push to gh-pages branch:
   ```bash
   git push -f origin HEAD:gh-pages
   ```
