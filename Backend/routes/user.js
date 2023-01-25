var router = require('express').Router();
var connection = require ('../database');
var jwt = require ('jsonwebtoken');
var nodemailer = require ('nodemailer');
var dotenv = require ('dotenv');
dotenv.config();
var auth = require ('../services/authentication')
var checkRole = require('../services/checkRole')


// SignUp 
router.post('/signup',(req,res)=>{
    let user = req.body;
    let query = "select email,password,role,status from user where email = ?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <= 0){
                let query = "insert into user(name,contactNumber,email,password,status,role) values (?, ?, ?, ?, 'false', 'user')";
                connection.query(query,[user.name, user.contactNumber, user.email, user.password], (err,result)=>{
                    if(!err){
                        return res.json({message : "successfully Register"})
                    }
                    else{
                        return res.json(err)
                    }
                })
            }
            else{
                return res.json({message : "Email Already exist"});
            }
        }else{
            return res.json(err)
        }
    })
});


// Login
router.post('/login',(req,res)=>{
    let user = req.body;
    let query = "select email,password,role,status from user where email = ?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <= 0 || result[0].password != user.password){
                return res.json({message : "Incorrect username or password!"});
            }
            else if(result[0].status === "false"){
                return res.json({message : "Wait for Admin approval"})
            }
            else if(result[0].password == user.password){
                const response = {email : result[0].email, role : result[0].role} 
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn : '8h'});
                res.json({message : accessToken});
            }
            else{
                return res.json({message : "Something went wrong! please try again later"});
            }
        }
        else{
            return res.json(err);
        }
    })
});


// forgotPassword
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
router.post('/forgotpassword',(req,res)=>{
    const user= req.body;
    let query = "select email, password from user where email = ?"
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length <= 0){
                return res.json({message : "Password sent successfully to your email"})
            }
            else{
                var mailOptions = {
                    from : process.env.EMAIL,
                    to : result[0].email,
                    subject : "Password by Cafe Management System",
                    html : '<p><b>Your Login details for Cafe Management System</b> <br> <b>Email:</b>' + result[0].email + '<br> <b>Password:</b>' + result[0].password + '<br><a href="http://localhost:4200/">Click here to login</a></p>'
                }
                transporter.sendMail(mailOptions, (err,infor)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Email sent' + info.response);
                    }
                });
                return res.json({message : "Password sent successfully to your email"})
            }
        }
        else{
           return res.json(err)
        }
        
    })
})

//get all user role
router.get('/getuser', auth.authenticateToken,(req,res)=>{
    let query = "select id,name,contactNumber,email,status from user where role='user'";
    connection.query(query,(err,result)=>{
        if(!err){
            return res.json(result);
        }else{
            return res.json(err)
        }
    })
})

// update status
router.patch('/update',(req,res)=>{
    let user = req.body;
    let query = "update user set status=? where id=?"
    connection.query(query,[user.status, user.id],(err,result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.json({message : "user id does not exist"})
            }
            return res.json({message : "User updated successfully"})
        }
        else{
            return res.json(err)
        }
    })
});

//checkToken
router.get('/checkToken',(req,res)=>{
    return res.json({message: "true"});
});



module.exports = router;