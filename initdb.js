const client = require('./db');
const format = require('pg-format');

const initDB = async () => {
    //  Alte Tabellen löschen 
    await client.query('DROP TABLE IF EXISTS tasks');
    await client.query('DROP TABLE IF EXISTS users');

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
            user_id INTEGER REFERENCES users(id)
        )
    `);

    // Beispieldaten für die Nutzer vorbereiten und mit pg-format einfügen
    const users = [
        ['Mama', 'geheim123', 'admin'],
        ['Papa', 'geheim123', 'admin'],
        ['Kind1', 'geheim123', 'user']
    ];
    await client.query(format('INSERT INTO users (username, password, role) VALUES %L', users));

    //  Beispieldaten für Putzaufgaben einfügen (user_id 1 = Mama, 2 = Papa, 3 = Kind1)
    const tasks = [
        ['Küche putzen', 1],
        ['Müll rausbringen', 3],
        ['Staubsaugen', 2]
    ];
    await client.query(format('INSERT INTO tasks (title, user_id) VALUES %L', tasks));
    
    console.log("Datenbank erfolgreich befüllt!");
};

module.exports = initDB;