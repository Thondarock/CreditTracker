# Deploying to GitHub Pages

This project is configured to be easily deployed to GitHub Pages.

## Prerequisites
1.  You must have a GitHub account.
2.  You must have Git installed on your computer.

## Step-by-Step Guide

### 1. Initialize Git (if you haven't already)
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create a Repository on GitHub
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name your repository (e.g., `credit-tracker`).
4.  Click **Create repository**.

### 3. Link Your Local Project to GitHub
Copy the commands shown on GitHub under "…or push an existing repository from the command line". They will look like this:
```bash
git remote add origin https://github.com/YOUR_USERNAME/credit-tracker.git
git branch -M main
git push -u origin main
```
*Run these commands in your terminal.*

### 4. Deploy!
Once your code is on GitHub, run this command in your terminal to deploy your live app:

```bash
npm run deploy
```

This command will:
1.  Build your project.
2.  Upload it to a special `gh-pages` branch.

### 5. View Your App
After a minute or two:
1.  Go to your GitHub repository settings.
2.  Scroll down to the **Pages** section (or click "Pages" in the sidebar).
3.  You will see your live URL (e.g., `https://your-username.github.io/credit-tracker/`).

---
**Note:** If you make changes later, just commit them and run `npm run deploy` again to update the live site.
