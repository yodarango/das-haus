const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/todos.db");

const items = [
  "Driveway",
  "Back patio",
  "Gutters",
  "Fascia",
  "Soffet",
  "Yards work",
  "Crawl space door",
  "Crawl space joist spacing",
  "Crawl space cleaning up",
  "Door knob basement",
  "Clean windows",
  "Vacuum vent system",
  "Inside electrical",
  "Wire panel box",
  "Outside electrical",
  "Speakers",
  "Ethernet cables",
  "WiFi access points",
  "Fireplace",
  "Frame doors to office",
  "Frame doors to study room",
  "Thea's vanity",
  "Visitors vanity",
  "Master vanity",
  "Plumbing",
  "Ac unit",
  "Garage doors",
  "Cabinets",
  "Appliances",
  "Countertops",
  "Backsplash",
  "Shower",
  "Master bathroom tile",
  "Thea bathroom tile",
  "Laundry room tile",
  "Flooring",
  "Window framing",
  "Doors",
  "Trim",
  "Painting imperfections",
  "Painting basement door",
  "Basement window trim exterior",
  "Basement door tighten frame",
  "Tighten basement window frame",
  "Security cameras",
  "Install stairs",
  "Porches",
  "Office bookshelves",
  "Office fireplace",
  "Playroom bookshelves",
  "Breakfast nook benches",
  "Closet shelves",
  "Laundry room shelves",
  "Amplifier",
  "Modem",
  "Split unit",
  "Toilets",
  "Our bed",
  "Thea bed",
  "Couch",
  "Living room rug",
  "Bedroom rug",
  "Projector bedroom",
  "Thea room rug"
];

db.serialize(() => {
  const stmt = db.prepare("INSERT INTO todos (name, notes) VALUES (?, ?)");
  
  items.forEach((item) => {
    stmt.run(item, "");
  });
  
  stmt.finalize((err) => {
    if (err) {
      console.error("Error inserting items:", err);
    } else {
      console.log(`✅ Successfully inserted ${items.length} items into the database!`);
    }
    db.close();
  });
});

