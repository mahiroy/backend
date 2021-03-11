// unclude library

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;


// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//default rout
//Access: public
// url http://localhot:500/api/users/
// method:GET
router.get(
    '/', (req, res) => {
        return res.status(200).json(
            {
                "status": true,
                "message": "user Default Route."
            });
    });


//user register routs
//Access: public
// url http://localhot:500/api/user/register 
// method:POST
router.post(
    '/register',
    [
        //check empty field
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),

        //check email
        check('email').isEmail().normalizeEmail()
    ],
    (req, res) => {
        const errors = validationResult(req);
        //check error is not empty
        if (!errors.isEmpty()) {
            return res.status(400).json({
                "status": false,
                "errors": errors.array()
            })
        }



        
        User.findOne({ email: req.body.email }).then(user => {
           //user email exist or not
            if (user) {
                return res.status(409).json({
                    "status": false,
                    "message": "user email alredy exist"
                });
            }
            else{

                const salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt);

                
                const newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password:hashedPassword
                });

                newUser.save().then(result =>{
                    return res.status(200).json({
                        "status": true,
                        "user": result
                    });
                }).catch(error =>{
                    return res.status(502).json({
                        "status": false,
                        "user": error
                    });
                })
            }
        }).catch(error =>{
            return res.status(502).json({
                "status": false,
                "user": error
            });
        })



       
    });


module.exports = router;