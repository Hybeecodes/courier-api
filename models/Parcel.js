const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi');

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
    destination: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'picked up', 'delivered']
    },
    timeLeft: {
        type: String,
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
        name: Joi.string().min(3).max(30).required()
    };
    return Joi.validate(parcel, schema);
}

exports= {
    Parcel,
    validate: validateParcel
};