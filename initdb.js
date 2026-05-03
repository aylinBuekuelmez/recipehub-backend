const express = require('express');
const router = express.Router();
const client = require('./db');
const format = require('pg-format');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
    await client.query('DROP TABLE IF EXISTS tasks CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    // Tabelle 'users' (Familienmitglieder) erstellen
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL
        )
    `);

    // Tabelle 'tasks' (Putzaufgaben) erstellen, verknüpft mit users(id)
    await client.query(`
        CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(255),
            status VARCHAR(20) DEFAULT 'open',
            user_id INTEGER REFERENCES users(id)
        )
    `);

    const passwordMama = await bcrypt.hash('geheim123', 10);
    const passwordPapa = await bcrypt.hash('geheim123', 10);
    const passwordKind1 = await bcrypt.hash('geheim123', 10);

    const users = [
        ['Mama', passwordMama, 'admin'],
        ['Papa', passwordPapa, 'admin'],
        ['Kind1', passwordKind1, 'user']
    ];
    await client.query(format('INSERT INTO users (username, password, role) VALUES %L', users));

    //  Beispieldaten für Putzaufgaben einfügen (user_id 1 = Mama, 2 = Papa, 3 = Kind1)
    const tasks = [
        ['Küche putzen','Arbeitsfläche reinigen und Boden wischen', 'open', 1],
        ['Müll rausbringen','Restmüll und Papiermüll rausbringen', 'open', 3],
        ['Staubsaugen','Wohnzimmer und Flur saugen', 'open', 2]
    ];
     const tasksQuery = format(
            'INSERT INTO tasks (title, description, status, user_id) VALUES %L RETURNING *',
            tasks
        );
       const result = await client.query(tasksQuery);

        res.status(200);
        res.send({
            message: 'Datenbank erfolgreich initialisiert und befüllt!',
            tasks: result.rows
        });
    } catch (err) {
        console.log(err);
        res.status(500);
        res.send({ error: 'Fehler bei der Initialisierung der Datenbank' });
    }
});

module.exports = router;