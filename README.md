# House Construction Todo List

This is a simple Node.js app to track the progress of your house construction. It uses Express.js for routing, EJS for markup, Tailwind CSS for styles, and SQLite for the database.

## Features

- View all todo items
- Add, edit, and delete items
- Mark items as purchased/installed
- Notes and dates for each item

## Tech Stack

- Node.js
- Express.js
- EJS
- Tailwind CSS
- SQLite

## Getting Started

1. Install dependencies: `npm install`
2. Run the app: `npm start`

## Folder Structure

- `views/` - EJS templates
- `public/` - Static assets (CSS, JS)
- `db/` - SQLite database file

## Database Table

| name   | is_purchased | is_installed | purchased_on | installed_on | notes  |
| ------ | ------------ | ------------ | ------------ | ------------ | ------ |
| string | bool         | bool         | date         | date         | string |

## License

MIT
