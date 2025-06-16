import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Configure MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'ecom'
});

// Handle POST request for user registration
app.post('/users', (req, res) => {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, password], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully" });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
