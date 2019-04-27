const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/Customer');
const _ = require('lodash');

router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let customer = await Customer.findOne({email: req.body.email});
        if(customer) return res.status(400).send('Customer Exists Already');

        customer = new Customer(_.pick(req.body,['name', 'email', 'phone', 'address']));
        await customer.save();
        res.status(200).send(customer);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
    
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        res.status(200).send(customer);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if(!customer) return res.status(400).send('Invalid Customer ID');

        await Customer.findByIdAndRemove(id);
        res.status(200).send('Customer Removed Successfully');
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;