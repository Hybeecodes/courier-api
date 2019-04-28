const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const { Customer, validate } = require('../models/Customer');
const { Parcel } = require('../models/Parcel');
const _ = require('lodash');

/**
 * @swagger
 *
 * /customers:
 *   post:
 *     description: Add New Customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Customer Name.
 *         required: true
 *         type: string
 *       - name: email
 *         description: Customer Email.
 *         required: true
 *         type: string
 *       - name: phone
 *         description: Customer Phone Number.
 *         required: true
 *         type: string
 *       - name: gender
 *         description: Customer Gender.
 *         required: true
 *         type: string
 *       - name: address
 *         description: Customer Address.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: customer
 */
router.post('/', async (req, res) => {
    try {
        // console.log(req.body);
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let customer = await Customer.findOne({email: req.body.email});
        if(customer) return res.status(400).send('Customer Exists Already');

        customer = new Customer(_.pick(req.body,['name', 'email', 'phone', 'address']));
        await customer.save();
        res.status(201).send(customer);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
    
});

/**
 * @swagger
 *
 * /customers/{id}:
 *   get:
 *     description: Get Customer By ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Customer ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: customer
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid Customer ID');
        const customer = await Customer.findById(id);
        res.status(200).send(customer);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /customers:
 *   get:
 *     description: Get All Customers
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: customers
 */
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /customers/{id}:
 *   delete:
 *     description: Delete Customer
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Customer ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description:
 */
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

/**
 * @swagger
 *
 * /customers/{id}/parcels:
 *   get:
 *     description: Get All Customer Parcels
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Customer ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: customer
 */
router.get('/:id/parcels', async (req,res) => {
    try {
        const { id } = req.params;
        // validate ObjectID
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid customer ID');
        // check if customer exists
        const customer = await Customer.findById(id);
        if(!customer) return res.status(400).send('Invalid Customer ID');
        const parcels = await Parcel.find({owner: id});
        res.status(200).send(parcels);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;