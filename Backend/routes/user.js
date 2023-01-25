var router = require('express').Router();
var connection = require ('../database');

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
})



module.exports = router;