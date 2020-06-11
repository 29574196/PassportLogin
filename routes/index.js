const express = require('express');
const router = express.Router();
const {ensureAunthenticated} = require('../config/off');

router.get('/',(req,res)=> res.render('welcome'));

//Dashboard
router.get('/dashboard',(req,res)=> res.render('dashboard',{
    name: req.user.name
}));

module.exports = router;