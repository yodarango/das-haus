#!/bin/zsh

source ~/.zshrc

# Check if a commit message was provided
if [ "$#" -ne 1 ]; then
    echo "Please provide a commit message"
    exit 1
fi

# The commit message is the first argument to the script
COMMIT_MESSAGE="$1"

# Add changes to the staging area
# You can adjust this to add specific files or use other git add options
git add .

# Commit the changes with the provided commit message
git commit -m "$COMMIT_MESSAGE"

# Push changes to the Git repository
git push --force

# Check if the push was successful
if [ $? -eq 0 ]; then
    echo "🐈 Done pushing changes to git. Now pulling changes to VPS."
else
    echo "Git push failed"
    exit 1
fi

# Copy the files to the VPS
ssh_main "\
cd /var/www/repos/danielrangel_net_das_haus/app; \
echo '💾 Backing up production database...'; \
if [ -f db/todos.db ]; then \
  cp db/todos.db db/backup.db; \
  echo '✅ Database backed up to db/backup.db'; \
  mkdir -p /var/www/backups; \
  cp db/todos.db /var/www/backups/todos_backup_\$(date +%Y%m%d_%H%M%S).db; \
  echo '✅ Timestamped backup created in /var/www/backups/'; \
else \
  echo '⚠️  No database found to backup'; \
fi; \
git fetch origin; \
git reset --hard origin/main; \
git pull; \
echo '👍 Pulled changes from git and reset to origin'; \
if [ -f db/backup.db ]; then \
  cp db/backup.db db/todos.db; \
  echo '✅ Production database restored from backup'; \
else \
  echo '🔧 No backup found, initializing new database...'; \
  docker compose run --rm our-house node db/initialize_production.js; \
fi; \
echo 'Current directory: '; pwd; \
echo '🏗️ Building docker now...';\
docker compose down; \
docker compose up -d --build; \
echo '🚀🚀🚀 Deployment successful'"


echo "⭐️🚀✅ Deployment successful"
