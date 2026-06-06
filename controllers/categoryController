const client = require('../db');

exports.getAllCategories = async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM categories ORDER BY id ASC'
        );

        res.status(200);
        res.send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Laden der Kategorien' });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const result = await client.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );

        res.status(201);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Erstellen der Kategorie' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const result = await client.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Kategorie nicht gefunden' });
            return;
        }

        res.status(200);
        res.send({ message: 'Kategorie gelöscht' });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Löschen der Kategorie' });
    }
};