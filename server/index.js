import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize Tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    period TEXT NOT NULL,
    url TEXT,
    icon TEXT,
    startDate TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    category TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`).run();

// Migration helper (idempotent)
try {
    db.prepare('ALTER TABLE subscriptions ADD COLUMN description TEXT').run();
} catch (e) { /* Column likely exists */ }
try {
    db.prepare("ALTER TABLE subscriptions ADD COLUMN status TEXT DEFAULT 'active'").run();
} catch (e) { /* Column likely exists */ }
try {
    db.prepare("ALTER TABLE subscriptions ADD COLUMN category TEXT").run();
} catch (e) { /* Column likely exists */ }
try {
    // 0 = false, 1 = true
    db.prepare("ALTER TABLE subscriptions ADD COLUMN pauseAtRenewal INTEGER DEFAULT 0").run();
} catch (e) { /* Column likely exists */ }

// Fix NULL IDs for existing bad data
try {
    const nullIds = db.prepare("SELECT rowid FROM subscriptions WHERE id IS NULL OR id = ''").all();
    if (nullIds.length > 0) {
        console.log(`Fixing ${nullIds.length} subscriptions with missing IDs...`);
        const updateStmt = db.prepare("UPDATE subscriptions SET id = ? WHERE rowid = ?");
        nullIds.forEach(row => {
            updateStmt.run(crypto.randomUUID(), row.rowid);
        });
    }
} catch (e) {
    console.error("Error fixing IDs:", e);
}

// Routes

// Get all subscriptions
app.get('/api/subscriptions', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM subscriptions ORDER BY createdAt DESC');
        const subscriptions = stmt.all();
        // Convert integer 0/1 to boolean for frontend if needed, OR handle 0/1 in frontend. 
        // SQLite uses 0/1 for booleans.
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a subscription
app.post('/api/subscriptions', (req, res) => {
    try {
        let { id, name, price, period, url, icon, startDate, description, status, category, pauseAtRenewal, createdAt } = req.body;

        // Generate ID if missing
        if (!id) {
            id = crypto.randomUUID();
        }

        // Simple validation
        if (!name || !price || !period) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const stmt = db.prepare(`
      INSERT INTO subscriptions (id, name, price, period, url, icon, startDate, description, status, category, pauseAtRenewal, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        // Ensure pauseAtRenewal is stored as 0 or 1
        const pauseVal = pauseAtRenewal ? 1 : 0;

        stmt.run(id, name, price, period, url, icon, startDate, description || '', status || 'active', category || 'Other', pauseVal, createdAt);

        res.status(201).json({ message: 'Subscription added successfully', id });
    } catch (error) {
        console.error('Error adding subscription:', error);
        res.status(500).json({ error: 'Failed to add subscription' });
    }
});

// Update a subscription
app.put('/api/subscriptions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, period, url, icon, startDate, description, status, category, pauseAtRenewal } = req.body;

        const stmt = db.prepare(`
      UPDATE subscriptions 
      SET name = ?, price = ?, period = ?, url = ?, icon = ?, startDate = ?, description = ?, status = ?, category = ?, pauseAtRenewal = ?
      WHERE id = ?
    `);

        const pauseVal = pauseAtRenewal ? 1 : 0;

        const info = stmt.run(name, price, period, url, icon, startDate, description, status, category, pauseVal, id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ message: 'Subscription updated successfully' });
    } catch (error) {
        console.error('Error updating subscription:', error);
        res.status(500).json({ error: 'Failed to update subscription' });
    }
});

// Delete a subscription
app.delete('/api/subscriptions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM subscriptions WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        res.json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subscription' });
    }
});

// Settings Endpoints
app.get('/api/settings', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM settings');
        const settings = stmt.all();
        // Convert array of {key, value} to object
        const settingsObj = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body; // Expect object { key: value, ... }
        const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

        const updateTransaction = db.transaction((settingsObj) => {
            for (const [key, value] of Object.entries(settingsObj)) {
                stmt.run(key, String(value));
            }
        });

        updateTransaction(settings);
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
