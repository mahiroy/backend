const jwt = require ('jsonwebtoken');
const token_key = process.env.TOKEN_KEY;
const User = require('./../models/User');


function veryfyToken (req,res,next){
    //read jwt token from HTTP Header
    const token = req.headers['x-access-token'];

    //check token is empty
    if (!token){
        return res.status(404).json({
            "status": false,
            "message": "JSON Web Token not fopunfr"
            

        });
        jwt.verify(token, token_key, function(errror, decoded){
            //check error
            if (error){
                return res.status(401).json({
                    "status": false,
                    "message": "JSON Web Token not decoded",
                    "error": error
                }); 
            }
            //check user exist or not in database
            User.findById(jwt.decode.id, {password:0,})
            .then(user =>{
                //check user is empty
                if (!user){
                    return res.status(401).json({
                        "status": false,
                        "message": "User don't exisit",
                       
                    });
                } 

                //set user object in req object
                req.yser = {
                    id:user.id,
                    email: user.email,
                    username:user.username
                };
                return next();

                     
            }).catch(error =>{
                return res.status(401).json({
                    "status": false,
                    "message": "Database error",
                   
                });
            })
        });
    }
}


module.exports = veryfyToken;