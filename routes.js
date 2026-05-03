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

module.exports = router;