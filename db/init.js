const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_purchased INTEGER DEFAULT 0,
    is_installed INTEGER DEFAULT 0,
    purchased_on TEXT,
    installed_on TEXT,
    notes TEXT
  )`);
});

module.exports = db;
