const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');

const parcelRouter = require('./routes/parcel');
const customerRouter = require('./routes/customer');

const app = express();

mongoose.connect('mongodb://localhost/courier-api', {useNewUrlParser: true, useCreateIndex: true})
.then(() => {
    console.log("Connected to DB Successfully");
})
.catch((err) => {
    console.log('Unable to Connect',err);
});

if(!config.get('JwtKey')){
    console.error('FATAL ERROR: JwtKey is not defined.');
    process.exit(1);
}

app.use(helmet());
app.use(logger('dev'));

app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('Welcome to Courier API');
});

app.use('/api/v1/parcels', parcelRouter);
app.use('/api/v1/customers', customerRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});