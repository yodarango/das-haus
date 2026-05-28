const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

console.log("\n=== ALL TODOS ===\n");

db.all("SELECT * FROM todos ORDER BY name", [], (err, rows) => {
  if (err) {
    console.error("Error:", err);
    return;
  }

  if (rows.length === 0) {
    console.log("No records found.");
    db.close();
    return;
  }

  // Print header
  console.log(
    "ID".padEnd(5),
    "Name".padEnd(30),
    "Cost".padEnd(10),
    "Priority".padEnd(10),
    "Purchased".padEnd(12),
    "Installed"
  );
  console.log("-".repeat(90));

  // Print each row
  rows.forEach((row) => {
    console.log(
      String(row.id).padEnd(5),
      String(row.name).substring(0, 28).padEnd(30),
      `$${(row.cost || 0).toFixed(2)}`.padEnd(10),
      String(row.priority || 0).padEnd(10),
      (row.is_purchased ? "✓" : "✗").padEnd(12),
      row.is_installed ? "✓" : "✗"
    );
  });

  console.log("\n=== SUMMARY ===");
  console.log(`Total items: ${rows.length}`);
  console.log(
    `Purchased: ${rows.filter((r) => r.is_purchased).length}`
  );
  console.log(
    `Installed: ${rows.filter((r) => r.is_installed).length}`
  );
  console.log(
    `Total cost: $${rows.reduce((sum, r) => sum + (r.cost || 0), 0).toFixed(2)}`
  );

  console.log("\n=== PRIORITY BREAKDOWN ===");
  for (let i = 1; i <= 5; i++) {
    const count = rows.filter((r) => r.priority === i).length;
    if (count > 0) {
      console.log(`Priority ${i}: ${count} items`);
    }
  }

  console.log("\n");
  db.close();
});
