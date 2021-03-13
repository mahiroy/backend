// unclude library

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult, body } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;
const veryfyToken = require('./../middleware/verify_token');
 

const storage = require('./storage');


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
                "errors": errors.array(),
                "message": "Form Validation error...."
            });
        }




        User.findOne({ email: req.body.email }).then(user => {

            //user email exist or not
            //check user
            if (user) {
                return res.status(409).json({
                    "status": false,
                    "message": "user email alredy exist"
                });
            }
            else {

                const salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(req.body.password, salt);


                const newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword
                });

                newUser.save().then(result => {
                    return res.status(200).json({
                        "status": true,
                        "user": result
                    });
                }).catch(error => {
                    return res.status(502).json({
                        "status": false,
                        "user": error
                    });
                });
            }

        }).catch(error => {
            return res.status(502).json({
                "status": false,
                "user": error
            });
        });




    });


//user profile pic routs
//Access: public
// url http://localhot:500/api/user/uploadProfilePic 
// method:POST

router.post(
    '/uploadProfilePic', (req, res) => {
        let upload = storage.getProfilePicUpload();
        upload(req, res, (error) => {

            if (error) {
                return res.status(400).json({
                    "status": false,
                    "error": error,
                    "message": "File upload error"
                });
            } else {
                return res.status(200).json({
                    "status": true,
                    "message": "File upload suscces"
                });
            }
        });
    });


//user login route
//Access: public
// url http://localhot:500/api/user/login 
// method:POST

router.post(
    '/login',
    [
        //check empty field
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
                "errors": errors.array(),
                "message": "Form Validation error...."

            });
        }

        User.findOne({ email: req.body.email }).then((user) => {
            //if user dont exist
            if (!user) {
                return res.status(404).json({
                    "status": false, 
                    "message": "User don't exist......"
                });
            }
            else {

                //match user password
                let isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);

                //check is not password match

                if (!isPasswordMatch) {
                    return res.status(401).json({
                        "status": false,
                        "message": "password don't match"
                    });
                }

                //jeson web token genrate
                let token = jwt.sign(
                    {
                        id: user._id,
                        email:user.email
                    },
                    token_key,
                    {
                        expiresIn: 3600
                    });
                //login success
                return res.status(200).json({
                    "status": true,
                    "message": "User Login Success",
                    "token": token,
                    "user" : user

                });
            } 

        }).catch((error) => {
            return res.status(502).json({
                "status": true,
                "message": "database error...."
            });
        });
    });



    //
    router.get('/testJWT' , veryfyToken, (req,res) => {
        return res.status(200).json({
            "status": true,
            "message": "JSON Web Token working...."
        });
    })



module.exports = router;