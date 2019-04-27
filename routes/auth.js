const config = require('config');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const cred = {
    user: 'dev',
    pass: 'dev'
}

router.post('/', (req,res) => {
    try {
        const { user, pass } = req.body;
        if(user === cred.user && pass === cred.pass){
            const token = jwt.sign(cred.user,config.get('JwtKey'), { expiresIn: '1h' });
            res.status(200).send(token);
        }else{
            res.status(400).send('Invalid Auth Credentials')
        }
    } catch (e) {
        console.log(e);
        res.status(400).send('Invalid Request');
    }
});

module.exports = router;
