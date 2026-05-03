const express = require('express');
const router = express.Router();
const client = require('./db'); 


router.get('/tasks', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tasks');
        res.status(200);
        res.send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Laden der Tasks' });
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await client.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );

        res.status(200);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Laden der Aufgabe' });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const { title, description, user_id } = req.body;

        const result = await client.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, 'open', user_id]
        );

        res.status(201);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Erstellen der Aufgabe' });
    }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, status } = req.body;

        const result = await client.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
            [title, description, status, id]
        );

        res.status(200);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Aktualisieren der Aufgabe' });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await client.query(
            'DELETE FROM tasks WHERE id = $1',
            [id]
        );

        res.status(200);
        res.send({ message: 'Aufgabe gelöscht' });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Löschen der Aufgabe' });
    }
});

module.exports = router;