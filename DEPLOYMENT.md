# Deployment Guide

## Database Safety

### ⚠️ IMPORTANT: Production Database Protection

The production database is **NEVER** overwritten during deployment. Here's how it works:

### Deployment Process

When you run `./deploy.sh "commit message"`, the following happens:

1. **Backup Creation** (on VPS):
   - Creates `db/backup.db` (permanent backup, overwrites on each deploy)
   - Creates timestamped backup in `/var/www/backups/todos_backup_YYYYMMDD_HHMMSS.db`

2. **Code Update**:
   - Fetches latest code from Git
   - Resets to origin/main (code only, database ignored)

3. **Database Restoration**:
   - Automatically restores `db/todos.db` from `db/backup.db`
   - If no backup exists, initializes new database

4. **Docker Rebuild**:
   - Stops containers
   - Rebuilds with new code
   - Starts containers with preserved database

### Database Files (Git Ignored)

The following files are **NOT tracked** in Git:
- `db/todos.db` - Production/local database
- `db/backup.db` - Production backup
- `db/*.db` - All database files
- `*.db-journal` - SQLite journal files

### Manual Database Operations

#### Sync Production → Local
```bash
./sync_db.sh
```
Downloads the production database to your local environment.

#### Restore Production from Local
```bash
scp db/todos.db root@96.30.194.79:/var/www/repos/danielrangel_net_das_haus/app/db/todos.db
ssh root@96.30.194.79 "cd /var/www/repos/danielrangel_net_das_haus/app && docker compose restart"
```

#### View Production Database
```bash
ssh root@96.30.194.79 "cd /var/www/repos/danielrangel_net_das_haus/app && docker exec our-house-app node db/view_records.js"
```

#### Restore from Timestamped Backup
```bash
ssh root@96.30.194.79
cd /var/www/repos/danielrangel_net_das_haus/app
ls -la /var/www/backups/  # Find the backup you want
cp /var/www/backups/todos_backup_YYYYMMDD_HHMMSS.db db/todos.db
docker compose restart
```

### Migration Scripts

When adding new database columns or making schema changes:

1. Create migration script in `db/` (e.g., `add_priority_column.js`)
2. Test locally first
3. After deployment, run on production:
```bash
ssh root@96.30.194.79 "cd /var/www/repos/danielrangel_net_das_haus/app && docker exec our-house-app node db/your_migration.js"
```

### Backup Locations

1. **VPS Permanent Backup**: `/var/www/repos/danielrangel_net_das_haus/app/db/backup.db`
2. **VPS Timestamped Backups**: `/var/www/backups/todos_backup_*.db`
3. **Local Development**: `./db/todos.db`

### Emergency Recovery

If production database is lost:

1. Check `/var/www/backups/` for timestamped backups
2. Check `db/backup.db` for latest backup
3. Sync from local if it has the latest data: `scp db/todos.db root@96.30.194.79:/var/www/repos/danielrangel_net_das_haus/app/db/todos.db`

### Docker Volume

The database persists via Docker volume mount in `docker-compose.yml`:
```yaml
volumes:
  - ./db:/app/db
```

This ensures the database survives container rebuilds.

## Deployment Checklist

Before deploying:
- [ ] Test changes locally
- [ ] Ensure database migrations are created (if schema changed)
- [ ] Commit all code changes
- [ ] Run `./deploy.sh "your commit message"`

After deploying:
- [ ] Check site is working
- [ ] Run any new database migrations if needed
- [ ] Verify data is intact

## Common Issues

### "No todos showing after deployment"
- Database was likely empty or not restored
- Check `db/backup.db` exists on VPS
- Restore from `/var/www/backups/` if needed

### "Schema error after deployment"
- Run migration script inside Docker container
- Example: `docker exec our-house-app node db/add_priority_column.js`

### "Can't connect to database"
- Check Docker container is running: `docker ps`
- Check logs: `docker logs our-house-app`
- Restart: `docker compose restart`
