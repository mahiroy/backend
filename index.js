//library include

require('dotenv').config();

const express =require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port = process.env.PORT;

//middleware
app.use(cors());
app.use(morgan('dev'));

//route
app.get('/', (req,res)=>{
    return res.status(200).json({
        "status" : true,
        "message" : "Amazon Clone Home Page." 
    });
});

//start server
app.listen(port,()=>{
    console.log("Server Running at port: " + port);
});