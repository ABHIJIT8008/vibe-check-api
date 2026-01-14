const express = require('express');
const app = express();
const db = require('./db');
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Vibe Check API is running! 🚀" });
});

app.post('/polls', (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || options.length === 0) {
        return res.status(400).json({ error: "Please provide a question and at least one option." });
    }

    const sqlPoll = `INSERT INTO polls (question) VALUES (?)`;
    db.run(sqlPoll, [question], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    
    const pollId = this.lastID;
    const sqlOption = `INSERT INTO options (poll_id, text) VALUES (?, ?)`;
    const stmt = db.prepare(sqlOption);
    
    options.forEach((optionText) => {
        stmt.run(pollId, optionText);
    });
    stmt.finalize();

    res.status(201).json({ 
            message: "Poll created successfully!", 
            pollId: pollId,
            question: question
        });
    });
});

app.get('/polls/:id', (req, res) => {
    const pollId = req.params.id;

    const sqlPoll = `SELECT * FROM polls WHERE id = ?`;
    
    db.get(sqlPoll, [pollId], (err, poll) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }

        const sqlOptions = `
            SELECT o.id, o.text, COUNT(v.id) as votes 
            FROM options o 
            LEFT JOIN votes v ON o.id = v.option_id 
            WHERE o.poll_id = ? 
            GROUP BY o.id
        `;

        db.all(sqlOptions, [pollId], (err, options) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                id: poll.id,
                question: poll.question,
                options: options
            });
        });
    });
});

app.post('/polls/:id/vote', (req, res) => {
    const pollId = req.params.id;
    const { option_id, user_id } = req.body;

    if (!option_id || !user_id) {
        return res.status(400).json({ error: "user_id and option_id are required." });
    }
    const sql = `INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)`;

    db.run(sql, [pollId, option_id, user_id], function(err) {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(403).json({ error: "You have already voted on this poll!" });
            }
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Vote cast successfully!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    }
);