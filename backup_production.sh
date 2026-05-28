#!/bin/bash

# Manual Production Database Backup Script
# Use this to create a backup of the production database on-demand

VPS_HOST="root@96.30.194.79"
VPS_APP_PATH="/var/www/repos/danielrangel_net_das_haus/app"
LOCAL_BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Creating production database backup..."
echo ""

# Create local backup directory if it doesn't exist
mkdir -p "$LOCAL_BACKUP_DIR"

# Create backup on VPS
echo "📦 Step 1: Creating backup on VPS..."
ssh "$VPS_HOST" "
  cd $VPS_APP_PATH
  mkdir -p /var/www/backups
  if [ -f db/todos.db ]; then
    cp db/todos.db /var/www/backups/todos_backup_${TIMESTAMP}.db
    cp db/todos.db db/backup.db
    echo '✅ VPS backup created: /var/www/backups/todos_backup_${TIMESTAMP}.db'
    echo '✅ VPS permanent backup updated: db/backup.db'
  else
    echo '❌ No database found on VPS!'
    exit 1
  fi
"

if [ $? -ne 0 ]; then
  echo "❌ Failed to create VPS backup"
  exit 1
fi

# Download backup to local
echo ""
echo "📥 Step 2: Downloading backup to local..."
scp "$VPS_HOST:$VPS_APP_PATH/db/todos.db" "$LOCAL_BACKUP_DIR/todos_backup_${TIMESTAMP}.db"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Backup completed successfully!"
  echo ""
  echo "📍 Backup locations:"
  echo "   VPS Timestamped:  /var/www/backups/todos_backup_${TIMESTAMP}.db"
  echo "   VPS Permanent:    $VPS_APP_PATH/db/backup.db"
  echo "   Local:            $LOCAL_BACKUP_DIR/todos_backup_${TIMESTAMP}.db"
  echo ""
else
  echo ""
  echo "⚠️  VPS backup created, but download to local failed"
  exit 1
fi
