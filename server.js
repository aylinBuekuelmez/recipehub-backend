const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const userRoutes = require('./routes/userRoutes');

const init = require('./initdb');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use('/init', init);
app.use('/users', userRoutes);

const taskRoutes = require('./routes/taskRoutes');

app.use('/tasks', taskRoutes);

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server started and listening on port ${PORT} ...`);
    }
});