const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const router = require('./routes');
app.use('/', router);
const initDB = require('./initdb');
app.get('/init', async (req, res) => {
    try {
        await initDB();
        res.send({ message: 'Datenbank erfolgreich initialisiert und befüllt!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Fehler bei der Initialisierung der Datenbank' });
    }
});

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ...`);
    }
});