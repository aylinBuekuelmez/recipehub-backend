const express = require('express');
const router = express.Router();
const client = require('./db');
const format = require('pg-format');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    try {
        await client.query('DROP TABLE IF EXISTS recipes CASCADE');
        await client.query('DROP TABLE IF EXISTS categories CASCADE');
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

        await client.query(`
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL
            )
        `);

        await client.query(`
        CREATE TABLE recipes (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(255),
            ingredients VARCHAR(500),
         category_id INTEGER REFERENCES categories(id),
            user_id INTEGER REFERENCES users(id)
        )
    `);

        const passwordAdmin = await bcrypt.hash('geheim123', 10);
        const passwordUser1 = await bcrypt.hash('geheim123', 10);
        const passwordUser2 = await bcrypt.hash('geheim123', 10);

        const users = [
            ['admin', passwordAdmin, 'admin'],
            ['anna', passwordUser1, 'user'],
            ['ben', passwordUser2, 'user']
        ];
        await client.query(format('INSERT INTO users (username, password, role) VALUES %L', users));
        const categories = [
            ['Türkische Küche'],
            ['Italienische Küche'],
            ['Vegan & Vegetarisch']
        ];
        await client.query(format('INSERT INTO categories (name) VALUES %L', categories));

        const recipes = [
            ['Mercimek Çorbası', 'Klassische türkische Linsensuppe', 'Rote Linsen, Zwiebel, Knoblauch, Kreuzkümmel, Paprika', 1, 2],
            ['Lahmacun', 'Türkische Fladenbrot-Pizza', 'Fladenbrot, Hackfleisch, Tomate, Zwiebel, Petersilie', 1, 3],
            ['Spaghetti Carbonara', 'Cremige Pasta ohne Sahne', 'Spaghetti, Eier, Pecorino, Guanciale, Pfeffer', 2, 2],
            ['Pizza Margherita', 'Klassiker aus Neapel', 'Pizzateig, Tomatensoße, Mozzarella, Basilikum', 2, 3],
            ['Avocado Toast', 'Schnelles veganes Frühstück', 'Vollkornbrot, Avocado, Zitrone, Chiliflocken', 3, 2],
            ['Vegane Bolognese', 'Bolognese mit Linsen statt Fleisch', 'Linsen, Tomaten, Karotten, Sellerie, Spaghetti', 3, 3]
        ];
        const result = await client.query(
            format('INSERT INTO recipes (title, description, ingredients, category_id, user_id) VALUES %L RETURNING *', recipes)
        );


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