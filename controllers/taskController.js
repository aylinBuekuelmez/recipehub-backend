const client = require('../db');

exports.getAllTasks = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tasks');
        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden der Tasks' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM tasks WHERE id = $1',
            [req.params.id]
        );
        if (result.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Aufgabe nicht gefunden' });
            return;
        }

        const task = result.rows[0];

        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
            res.status(403);
            res.send({ message: 'Keine Berechtigung' });
            return;
        }
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden der Aufgabe' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, user_id } = req.body;

        if (!title || !user_id) {
            res.status(400);
            res.send({ message: 'Titel und User-ID müssen angegeben werden' });
            return;
        }

        const result = await client.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, 'open', user_id]
        );

        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Erstellen der Aufgabe' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { title, description, status } = req.body;

        const taskResult = await client.query(
            'SELECT * FROM tasks WHERE id = $1',
            [taskId]
        );

        if (taskResult.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Aufgabe nicht gefunden' });
            return;
        }

        const task = taskResult.rows[0];
        if (req.user.role !== 'admin' && task.user_id !== req.user.id) {
            res.status(403);
            res.send({ message: 'Keine Berechtigung' });
            return;
        }

        const result = await client.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
            [title, description, status, taskId]
        );

        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Aktualisieren' });
    }
};

exports.deleteTask = async (req, res) => {
    try {

        const result = await client.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Aufgabe nicht gefunden' });
            return;
        }

        res.status(200);
        res.send({
            message: 'Aufgabe gelöscht',
            task: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Löschen' });
    }
};

exports.getMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await client.query(
            'SELECT * FROM tasks WHERE user_id = $1',
            [userId]
        );

        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden der Tasks' });
    }
};