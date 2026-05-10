const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

// Add cost column to todos table
db.serialize(() => {
  db.run(`ALTER TABLE todos ADD COLUMN cost REAL DEFAULT 0`, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("✓ Cost column already exists");
      } else {
        console.error("Error adding cost column:", err);
      }
    } else {
      console.log("✅ Successfully added cost column to todos table!");
    }
    db.close();
  });
});
