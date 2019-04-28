const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const bearerToken = require('express-bearer-token');
const jwt = require('jsonwebtoken');

const parcelRouter = require('./routes/parcel');
const customerRouter = require('./routes/customer');
const authRouter = require('./routes/auth');

const app = express();

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds149146.mlab.com:49146/courier`, {useNewUrlParser: true, useCreateIndex: true})
.then(() => {
    console.log("Connected to DB Successfully");
})
.catch((err) => {
    console.log('Unable to Connect: ',err);
});
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Courier API',
      version: '1.0.0',
      description: 'API for courier Service',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['routes/customer.js','routes/parcel.js'],
};

const specs = swaggerJsdoc(options);

const swaggerUi = require('swagger-ui-express');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// if(!process.env.JWT_KEY){
//     console.error('FATAL ERROR: JwtKey is not defined.');
//     process.exit(1);
// }

app.use(helmet());
app.use(logger('dev'));

app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send('Welcome to Courier API');
});
app.use('/api/v1/auth', authRouter);

app.use(bearerToken());
app.use(function (req, res, next) {
    try {
        if(jwt.verify(req.token,process.env.JWT_KEY) !== process.env.AUTH_USER){
            return res.status(403).send('Unauthorized');
        }
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).send('Unauthorized');
    }
  
});

app.use('/api/v1/parcels', parcelRouter);
app.use('/api/v1/customers', customerRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});