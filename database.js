// include library

const mongoose = require('mongoose');
const assert = require('assert');
const db_url = process.env.DB_URL; 

mongoose.connect(

db_url,
{
    useNewUrlParser: true, useUnifiedTopology: true ,
    useUnifiedTopology : true,
    useCreateIndex: true,
    useFindAndModify: true,
},
(error, link) =>{
    //check database connect error
    assert.strictEqual(error, null, "DB Connect fail....");

    //database connect success
    console.log(link);
}
)