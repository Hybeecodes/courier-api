const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/', (req,res) => {
    try {
        const { user, pass } = req.body;
        if(user === process.env.AUTH_USER && pass === process.env.AUTH_PASS){
            const token = jwt.sign(process.env.AUTH_USER,process.env.JWT_KEY);
            res.status(200).send(token);
        }else{
            res.status(400).send('Invalid Auth Credentials')
        }
    } catch (e) {
        console.log(e);
        res.status(400).send('Invalid Request');
    }
});

// router.post('/', (req,res) => {
//     try {
//         const { user, pass } = req.body;
//         if(user === 'dev_courier' && pass === 'RTAr3Us{g2K.Z?mW'){
//             const token = jwt.sign('dev_courier','hdudjhf');
//             res.status(200).send(token);
//         }else{
//             res.status(400).send('Invalid Auth Credentials')
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(400).send('Invalid Request');
//     }
// });

module.exports = router;
