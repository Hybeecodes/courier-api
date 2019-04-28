const express = require('express');
const router = express.Router();
const { Customer } = require('../models/Customer');
const { Parcel, validate } = require('../models/Parcel');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');

/**
 * @swagger
 *
 * /parcels:
 *   post:
 *     description: Add New Parcel
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Customer Name.
 *         required: true
 *         type: string
 *       - name: owner
 *         description: Customer ID.
 *         required: true
 *         type: string
 *       - name: weight
 *         description: Weight of Parcel.
 *         required: true
 *         type: number
 *       - name: destinationAddress
 *         description: Address where Parcel will be dlivered to.
 *         required: true
 *         type: string
 *       - name: destinationCity
 *         description: destination City.
 *         required: true
 *         type: string
 *       - name: status
 *         description: status of parcel.
 *         required: true
 *         type: string
 *       - name: arrivalTime
 *         description: estimated date and time of parcel arrival at destination.
 *         required: true
 *         type: date
 *       - name: cost
 *         description: cost of delivery.
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: customer
 */
router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.owner);
        if(!customer) return res.status(400).send('Customer does not exist');

    const parcel = new Parcel(_.pick(req.body, ['name', 'owner', 'weight', 'destinationAddress', 'destinationCity', 'destinationDistance', 'status', 'arrivalTime', 'cost']));
    await parcel.save();
    res.status(200).send(parcel);
});

/**
 * @swagger
 *
 * /parcels/{id}:
 *   get:
 *     description: Get Parcel By ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: parcel
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid Parcel ID');
        const parcel = await Parcel.findById(id);
        res.status(200).send(parcel);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /parcels/{id}/track:
 *   get:
 *     description: Get Parcel delivery status
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: parcel delivery status
 */
router.get('/:id/track', async (req,res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid Parcel ID');
        const parcel = await Parcel.findById(id).select('name status -_id');
        res.status(200).send(parcel);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /parcels:
 *   get:
 *     description: Get All Parcels
 *     produces:
 *       - application/json
 *     parameters:
 *     queries:
 *       - name: status
 *         description: status to filter by (pending, picked-up, delivered).
 *         type: string
 *       - name: destination
 *         description: destination city to filter by.
 *         type: string
 *     responses:
 *       200:
 *         description: parcels
 */
router.get('/', async (req,res) => {
    try {
        const { status, destinationCity } = req.query;
        let parcels = [];
        if(!status){
            if(!destinationCity){
                parcels = await Parcel.find();
            }else{
                parcels = await Parcel.find({destinationCity});
            }
        }else{
            switch (status) {
                case 'pending':
                    parcels = await Parcel.find({status: 'pending'});
                    break;
                case 'picked-up':
                    parcels = await Parcel.find({status: 'pickedUp'});
                    break;
                case 'delivered':
                    parcels = await Parcel.find({status: 'delivered'});
                    break;
                default:
                    parcels = await Parcel.find();
                    break;
            }
        }
        
        res.status(200).send(parcels);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /parcels/{id}/pickup:
 *   get:
 *     description: pick up parcel (change parcel status )
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: parcel 
 */
router.post('/:id/pickup', async (req,res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid Parcel ID');
        const parcel = await Parcel.findById(id);
        if(!parcel) return res.status(400).send('Invalid Parcel ID');
        parcel.status = 'pickedUp';
        await parcel.save();
        res.status(200).send(parcel);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

/**
 * @swagger
 *
 * /parcels/{id}/deliver:
 *   get:
 *     description: deliver parcel (change parcel status )
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: parcel 
 */
router.post('/:id/deliver', async (req,res) => {
    try {
        const { id } = req.params;
        if(!ObjectId.isValid(id)) return res.status(400).send('Invalid Parcel ID');
        const parcel = await Parcel.findById(id);
        if(!parcel) return res.status(400).send('Invalid Parcel ID');
        parcel.status = 'delivered';
        await parcel.save();
        res.status(200).send(parcel);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


/**
 * @swagger
 *
 * /parcels/{id}:
 *   delete:
 *     description: Delete Parcel
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Parcel ID.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description:
 */
router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const parcel = await Parcel.findById(id);
        if(!parcel) return res.status(400).send('Invalid Parcel ID');

        await Parcel.findByIdAndRemove(id);
        res.status(200).send('Parcel Removed Successfully');
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;