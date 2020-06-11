const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');

//Login
router.get('/login',(req,res)=> res.render('login'));

//Register
router.get('/register',(req,res)=> res.render('register'));

//Register handle, saving user details
router.post('/register',(req,res)=> {
    const { name,email,password,password2 }= req.body;

    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2)
    {
        errors.push({msg: 'Please fill in all fields'});
    }

    //Check password match
    if(password != password2)
    {
        errors.push({msg: 'Passwords do not match'});
    }

    //Check password length
    if(password.length < 6)
    {
        errors.push({msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0)
    {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //Validation pass
        User.findOne({emai: email}).then(user => {
            if(user)
            {
                //if there is a user and exists
                errors.push({msg: 'EMail is already registred'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                //If user does not exist. Adding new user
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Hash Password
                bcrypt.genSalt(10, (err,salt) => 
                    bcrypt.hash(newUser.password, salt,(err,hash)=> {
                        if(err) throw err;
                        //Set password to hashed.
                        newUser.password = hash;

                        //Save user in database
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You are now registered');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }
})

//login handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logout handle
router.get('/logout',(req,res)=> {
    req.logout();
    req.flash('success_msg', "You are logged out");
    res.redirect('/users/login')
})

module.exports = router;
