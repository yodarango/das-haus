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

// List all todos
app.get("/", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).send("DB error");
    res.render("index", { todos: rows });
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
  const {
    name,
    is_purchased,
    is_installed,
    purchased_on,
    installed_on,
    notes,
  } = req.body;
  db.run(
    `UPDATE todos SET name=?, is_purchased=?, is_installed=?, purchased_on=?, installed_on=?, notes=? WHERE id=?`,
    [
      name,
      is_purchased ? 1 : 0,
      is_installed ? 1 : 0,
      purchased_on,
      installed_on,
      notes,
      id,
    ],
    (err) => {
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
