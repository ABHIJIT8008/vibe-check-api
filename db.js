const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./polls.db',(err)=>{
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

db.serialize(() =>{
    db.run(`CREATE TABLE IF NOT EXISTS polls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL
        )`);

    db.run(`CREATE TABLE IF NOT EXISTS options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER,
        text TEXT NOT NULL,
        FOREIGN KEY (poll_id) REFERENCES polls (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poll_id INTEGER,
        option_id INTEGER,
        user_id TEXT NOT NULL,
        FOREIGN KEY (poll_id) REFERENCES polls (id),
        FOREIGN KEY (option_id) REFERENCES options (id),
        UNIQUE(user_id, poll_id)
    )`);
});

module.exports = db;