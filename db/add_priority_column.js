const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

// Add priority column to todos table
db.serialize(() => {
  db.run(`ALTER TABLE todos ADD COLUMN priority INTEGER DEFAULT 1`, (err) => {
    if (err) {
      if (err.message.includes("duplicate column name")) {
        console.log("✓ Priority column already exists");
      } else {
        console.error("Error adding priority column:", err);
      }
    } else {
      console.log("✅ Successfully added priority column to todos table!");
    }
    db.close();
  });
});
