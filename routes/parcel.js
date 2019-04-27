const express = require('express');
const router = express.Router();
const { Parcel, validate } = require('../models/Parcel');
const mongoose = require('mongoose');

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const parcel = new Parcel({
        
    })
});

module.exports = router;