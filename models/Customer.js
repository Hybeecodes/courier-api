const mongoose = require('mongoose');
const { Schema } = mongoose;
const Joi = require('joi');

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    phone: { type: String, required: true},
    gender: { type: String, enum: ['male', 'female']},
    address: { type: String, required: true}
}, { timestamps: true});

const Customer = mongoose.model('Customer', CustomerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).max(100).required().label('Customer Name'),
        email: Joi.string().max(255).email({minDomainAtoms: 2}).required(),
        phone: Joi.string().min(11).required(),
        gender: Joi.string().required(),
        address: Joi.string().min(20).required()
    };
    return Joi.validate(customer,schema);
}

exports.Customer = Customer;
   
exports.validate = validateCustomer;
