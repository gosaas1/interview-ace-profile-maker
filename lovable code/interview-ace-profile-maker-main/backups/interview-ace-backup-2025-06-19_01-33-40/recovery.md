# Project Recovery Guide

## Quick Recovery Steps

If the project fails or gets corrupted, follow these steps:

### 1. Reset to Last Working Version
```bash
# Reset to the last working commit
git reset --hard HEAD~1

# Or reset to a specific working commit
git reset --hard <commit-hash>
```

### 2. Restore from Backup Branch
```bash
# Switch to backup branch
git checkout backup/working-version

# Create new main branch from backup
git checkout -b main-new
git push origin main-new

# Force update main branch
git checkout main
git reset --hard main-new
git push origin main --force
```

### 3. Complete Fresh Start
```bash
# Clone fresh from GitHub
git clone https://github.com/gosaas1/interview-ace-profile-maker.git
cd interview-ace-profile-maker

# Install dependencies
npm install

# Start development server
npm run dev
```

## Important Commits to Remember

- **Working Version**: `backup/working-version` branch
- **Main Development**: `main` branch

## Environment Setup

1. **Node.js**: Version 18+ required
2. **npm**: Latest version
3. **Supabase**: Configure environment variables

## Troubleshooting

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### If development server won't start:
```bash
# Check port availability
netstat -ano | findstr :8080

# Kill process on port 8080 (Windows)
taskkill /PID <PID> /F
```

### If Git issues occur:
```bash
# Reset Git state
git reset --hard HEAD
git clean -fd

# Pull latest changes
git pull origin main
```

## Backup Strategy

1. **Daily commits** for major changes
2. **Feature branches** for new development
3. **Backup branch** for stable versions
4. **GitHub as remote backup**

## Contact

If you need help with recovery, check:
1. Git commit history
2. GitHub repository
3. This recovery guide 