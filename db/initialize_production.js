const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

console.log("🔧 Initializing production database...\n");

db.serialize(() => {
  // Create table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      is_purchased INTEGER DEFAULT 0,
      is_installed INTEGER DEFAULT 0,
      purchased_on TEXT,
      installed_on TEXT,
      notes TEXT,
      cost REAL DEFAULT 0,
      priority INTEGER DEFAULT 0
    )`,
    (err) => {
      if (err) {
        console.error("❌ Error creating table:", err);
        db.close();
        return;
      }
      console.log("✅ Table 'todos' created or already exists");

      // Check if we have any data
      db.get("SELECT COUNT(*) as count FROM todos", [], (err, row) => {
        if (err) {
          console.error("❌ Error checking data:", err);
          db.close();
          return;
        }

        console.log(`📊 Current records in database: ${row.count}`);

        if (row.count === 0) {
          console.log("\n⚠️  Database is empty!");
          console.log("If you had data before, you need to restore from backup.");
          console.log("Options:");
          console.log("1. Copy backup database: cp /path/to/backup.db ./db/todos.db");
          console.log("2. Use the sync_db.sh script if available");
          console.log("3. Manually re-enter data through the app\n");
        } else {
          console.log("✅ Database has data!\n");
        }

        db.close();
      });
    }
  );
});
