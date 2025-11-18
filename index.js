const express = require("express");
const path = require("path");
const db = require("./db/init");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Helper function to parse MM/DD/YY format to YYYY-MM-DD
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === "") return null;

  // Match MM/DD/YY format
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  if (!match) return null;

  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Validate ranges
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  // Convert 2-digit year to 4-digit (assume 2000s)
  const fullYear = 2000 + year;

  // Create date and validate it's real
  const date = new Date(fullYear, month - 1, day);
  if (
    date.getFullYear() !== fullYear ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  // Return in YYYY-MM-DD format
  const yyyy = String(fullYear);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Helper function to format YYYY-MM-DD to MM/DD/YY for display
function formatDateForDisplay(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

// List all todos
app.get("/", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).send("DB error");

    // Format dates for display
    const todosWithFormattedDates = rows.map((todo) => ({
      ...todo,
      purchased_on_display: formatDateForDisplay(todo.purchased_on),
      installed_on_display: formatDateForDisplay(todo.installed_on),
    }));

    res.render("index", { todos: todosWithFormattedDates });
  });
});

// Create todo
app.post("/add", (req, res) => {
  const { name, notes } = req.body;
  db.run(
    "INSERT INTO todos (name, notes) VALUES (?, ?)",
    [name, notes],
    (err) => {
      res.redirect("/");
    }
  );
});

// Update todo
app.post("/update/:id", (req, res) => {
  const { id } = req.params;
  const { name, purchased_on, installed_on, notes } = req.body;

  // Parse and validate dates
  const parsedPurchasedOn = parseDate(purchased_on);
  const parsedInstalledOn = parseDate(installed_on);

  // If date was provided but invalid, send error
  if (purchased_on && purchased_on.trim() !== "" && !parsedPurchasedOn) {
    return res.status(400).send("Invalid purchased date format. Use MM/DD/YY");
  }
  if (installed_on && installed_on.trim() !== "" && !parsedInstalledOn) {
    return res.status(400).send("Invalid installed date format. Use MM/DD/YY");
  }

  // Only update name, dates, and notes - NOT the checkboxes
  db.run(
    `UPDATE todos SET name=?, purchased_on=?, installed_on=?, notes=? WHERE id=?`,
    [name, parsedPurchasedOn, parsedInstalledOn, notes, id],
    (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Database error");
      }
      res.redirect("/");
    }
  );
});

// Delete todo
app.post("/delete/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id=?", [req.params.id], (err) => {
    res.redirect("/");
  });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
