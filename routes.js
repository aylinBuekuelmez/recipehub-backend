const express = require('express');
const router = express.Router();
const client = require('./db'); 


router.get('/', (req, res) => {
    res.send({ message: 'Hello FairHome Backend!' });
});

module.exports = router;