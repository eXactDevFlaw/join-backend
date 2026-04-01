const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, async (req, res) => {
    try {
        const tasks = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');
        const subtasks = await pool.query('SELECT * FROM subtasks');
        const result = tasks.rows.map(task => ({
            ...task,
            subtasks: subtasks.rows.filter(s => s.task_id === task.id)
        }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', auth, async (req, res) => {
    const { title, description, due_date, priority, category, status, assigned_to } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, description, due_date, priority, category, status, assigned_to)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, due_date, priority, category, status || 'todo', assigned_to]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, description, due_date, priority, category, status, assigned_to } = req.body;
    try {
        const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
        if (existing.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        const task = existing.rows[0];

        const result = await pool.query(
            `UPDATE tasks SET title=$1, description=$2, due_date=$3, priority=$4,
     category=$5, status=$6, assigned_to=$7 WHERE id=$8 RETURNING *`,
            [
                title ?? task.title,
                description ?? task.description,
                due_date ?? task.due_date,
                priority ?? task.priority,
                category ?? task.category,
                status ?? task.status,
                assigned_to ?? task.assigned_to ?? [],
                req.params.id
            ]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PUT error:', JSON.stringify(err.message));
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM subtasks WHERE task_id = $1', [req.params.id]);
        await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/:id/subtasks', auth, async (req, res) => {
    const { title, done } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO subtasks (task_id, title, done) VALUES ($1, $2, $3) RETURNING *',
            [req.params.id, title, done || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *',
            [status, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('PATCH status error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;