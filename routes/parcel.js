const express = require('express');
const router = express.Router();
const { Customer } = require('../models/Customer');
const { Parcel, validate } = require('../models/Parcel');
const ObjectId = require('mongodb').ObjectId;
const _ = require('lodash');

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.owner);
        if(!customer) return res.status(400).send('Customer does not exist');

    const parcel = new Parcel(_.pick(req.body, ['name', 'owner', 'weight', 'destinationAddress', 'destinationCity', 'destinationDistance', 'status', 'arrivalTime', 'cost']));
    await parcel.save();
    res.status(200).send(parcel);
});

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


router.get('/:city', async (req,res) => {
    try {
        const { city } = req.params;
        const parcels = await Parcel.find({destinationCity: city});
        res.status(200).send(parcels);
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


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

module.exports = router;