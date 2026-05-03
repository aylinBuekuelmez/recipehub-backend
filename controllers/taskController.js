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
        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden der Aufgabe' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, description, user_id } = req.body;

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
        const { title, description, status } = req.body;

        const result = await client.query(
            'UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
            [title, description, status, req.params.id]
        );

        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Aktualisieren' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await client.query(
            'DELETE FROM tasks WHERE id = $1',
            [req.params.id]
        );

        res.status(200).send({ message: 'Gelöscht' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Löschen' });
    }
};