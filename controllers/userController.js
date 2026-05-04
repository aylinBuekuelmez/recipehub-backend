const client = require('../db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const role = 'user';

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