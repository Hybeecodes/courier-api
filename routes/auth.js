const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/', (req,res) => {
    try {
        const { user, pass } = req.body;
        if(user === process.env.AUTH_USER && pass === process.env.AUTH_PASS){
            const token = jwt.sign(process.env.AUTH_USER,process.env.JWT_KEY, { expiresIn: '5h' });
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
