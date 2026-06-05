const client = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = 'user';

        if (!username || !password) {
            res.status(400);
            res.send({ message: 'Username und Passwort müssen angegeben werden' });
            return;
        }

        const check = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (check.rowCount > 0) {
            res.status(401);
            res.send({ message: `username ${username} already exists` });
            return;
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users(username, password, role)
            VALUES ($1, $2, $3)
            RETURNING id, username, role
        `;

        const result = await client.query(query, [
            username,
            hashPassword,
            role
        ]);

        res.status(201);
        res.send(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler bei der Registrierung' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password) {
            res.status(400);
            res.send({ message: 'Username und Passwort müssen angegeben werden' });
            return;
        }

        const result = await client.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rowCount === 0) {
            res.status(401);
            res.send({ message: 'username/password wrong' });
            return;
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            res.status(401);
            res.send({ message: 'username/password wrong' });
            return;
        }

        const userWithoutPassword = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(
            userWithoutPassword,
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200);
        res.send({
            token: token,
            user: userWithoutPassword
        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Login' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await client.query(
            'SELECT id, username, role FROM users ORDER BY id'
        );

        res.status(200);
        res.send(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Laden der Nutzer' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await client.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rowCount === 0) {
            res.status(404);
            res.send({ error: 'Nutzer nicht gefunden' });
            return;
        }

        res.status(200);
        res.send({ message: 'Nutzer gelöscht', user: result.rows[0] });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler beim Löschen des Nutzers' });
    }
};