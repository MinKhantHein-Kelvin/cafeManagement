var express = require ('express');
var connection = require ('./database');
var dotenv = require ('dotenv');
dotenv.config();
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// import route
const userRoute = require ('./routes/user.js');

//middle ware
app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

//Route Middleware
app.use('/user', userRoute);




app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port 3000");
    connection.connect((err)=>{
        if(err) throw err;
        console.log('Database Connection Successed');
    })
})