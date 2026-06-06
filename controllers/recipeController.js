const client = require('../db');

exports.getAllRecipes = async (req, res) => {
    try {
        const categoryId = req.query.category;
        let result;

        if (categoryId) {
            result = await client.query(
                'SELECT * FROM recipes WHERE category_id = $1 ORDER BY id DESC',
                [categoryId]
            );
        } else {
            result = await client.query('SELECT * FROM recipes ORDER BY id DESC');
        }
        res.status(200).send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden der Rezepte' });
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const result = await client.query(
            'SELECT * FROM recipes WHERE id = $1',
            [req.params.id]
        );
        if (result.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Rezept nicht gefunden' });
            return;
        }


        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Laden des Rezepts' });
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, category_id, user_id } = req.body;
        const userId = req.user.id;



        const result = await client.query(
            'INSERT INTO recipes (title, description, ingredients, category_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, ingredients, category_id, userId]
        );

        res.status(201).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Erstellen des Rezepts' });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const recipeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, description, ingredients, category_id } = req.body;

        const checkResult = await client.query(
            'SELECT * FROM recipes WHERE id = $1',
            [recipeId]
        );

        if (checkResult.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Rezept nicht gefunden' });
            return;
        }

        if (checkResult.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Rezept nicht gefunden' });
            return;
        }

        if (checkResult.rows[0].user_id !== userId && userRole !== 'admin') {
            res.status(403);
            res.send({ message: 'Keine Berechtigung' });
            return;
        }

        const result = await client.query(
            'UPDATE recipes SET title = $1, description = $2, ingredients = $3, category_id = $4 WHERE id = $5 RETURNING *',
            [title, description, ingredients, category_id, recipeId]
        );

        res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Fehler beim Aktualisieren des Rezepts' });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {

        const recipeId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        const checkResult = await client.query(
            'SELECT * FROM recipes WHERE id = $1',
            [recipeId]
        );

        if (checkResult.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Rezept nicht gefunden' });
            return;
        }

        if (checkResult.rows[0].user_id !== userId && userRole !== 'admin') {
            res.status(403);
            res.send({ error: 'Keine Berechtigung' });
            return;
        }

        await client.query(
            'DELETE FROM recipes WHERE id = $1 RETURNING *',
            [recipeId]
        );

        res.status(200);
        res.send({
            message: 'Rezept gelöscht',

        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Löschen des Rezepts' });
    }
};

