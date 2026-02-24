# GitHub Setup Guide

## After installing Git, follow these steps:

### 1. Configure Git with your GitHub credentials
```bash
# Set your GitHub username
git config --global user.name "YourGitHubUsername"

# Set your GitHub email
git config --global user.email "your.github.email@example.com"

# Verify configuration
git config --global --list
```

### 2. Initialize or connect your repository
```bash
# If this is a new repository
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YourUsername/YourRepository.git
git branch -M main
git push -u origin main
```

### 3. Set up GitHub authentication

#### Option A: Personal Access Token (Recommended)
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with repo permissions
3. Use this token as your password when pushing to GitHub

#### Option B: GitHub CLI (Alternative)
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate with GitHub
gh auth login
```

### 4. Common Git commands for your workflow
```bash
# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Check status
git status
```

### 5. Example workflow for this project
```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Add project assets"

# Push to GitHub (you'll need to create a repository on GitHub first)
git push origin main
```

## Important Notes:
- Replace "YourGitHubUsername" with your actual GitHub username
- Replace "your.github.email@example.com" with your GitHub account email
- Make sure to create a repository on GitHub.com before pushing
- Use the same email address that you use for your GitHub account