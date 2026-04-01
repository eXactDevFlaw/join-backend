const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { name, email, phone, color } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO contacts (name, email, phone, color) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phone, color]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, color } = req.body;
    try {
        const result = await pool.query(
            'UPDATE contacts SET name=$1, email=$2, phone=$3, color=$4 WHERE id=$5 RETURNING *',
            [name, email, phone, color, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Contact not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM contacts WHERE id = $1', [req.params.id]);
        res.json({ message: 'Contact deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;