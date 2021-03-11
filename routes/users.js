// unclude library
 
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;
 
// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

 
//default rout
//Access: public
// url http://localhot:500 
router.get(
    '/', (req,res) =>{
        res.status(200).json(
            {
                "status": true,
                "message": "user Default Route."
            });
    });


    module.exports = router;