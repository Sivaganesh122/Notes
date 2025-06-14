const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = 'your-secret-key';

let users = [];
let notes = {};

app.use(cors());
app.use(bodyParser.json());

// Register user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.json({ message: 'User registered successfully' });
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Get user notes (protected)
app.get('/notes', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const userNotes = notes[decoded.username] || [];
        res.json({ notes: userNotes });
    } catch {
        res.status(403).json({ message: 'Invalid token' });
    }
});

// Add note (protected)
app.post('/notes', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const username = decoded.username;
        const { note } = req.body;
        if (!notes[username]) notes[username] = [];
        notes[username].push(note);
        res.json({ message: 'Note added' });
    } catch {
        res.status(403).json({ message: 'Invalid token' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
