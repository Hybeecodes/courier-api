const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const ParcelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    destinationAddress: {
        type: String,
        required: true
    },
    destinationCity: {
        type: String,
        required: true
    },
    destinationDistance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'pickedUp', 'delivered'],
        default: 'pending'
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        required: true
    }
}, { timestamps: true});

const Parcel = mongoose.model('Parcel', ParcelSchema);

function validateParcel(parcel) {
    const schema = {
        name: Joi.string().min(3).max(30).required(),
        owner: Joi.objectId(),
        weight: Joi.number().min(0).required(),
        destinationAddress: Joi.string().min(10).required(),
        destinationCity: Joi.string().min(3).required(),
        destinationDistance: Joi.number().min(0).required(),
        status: Joi.string(),
        arrivalTime: Joi.date().required(),
        cost: Joi.number().min(0).required()
    };
    return Joi.validate(parcel, schema);
}

exports.Parcel = Parcel;
exports.validate = validateParcel;
