const express  = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

require('./config/passport')(passport);


const app = express();

//Mongoose
const db = require('./config/keys').MongoURI;

//Connect Mongo
mongoose.connect(db,{useNewUrlParser: true}).then(() => console.log('MongoDb connected'))
.catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser that is in express
app.use(express.urlencoded({ extended: false}));

//Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req,res,next) => {
    res.locals.success_msg  =req.flash('success_msg');
    res.locals.error_msg  =req.flash('error_msg');
    res.locals.error  =req.flash('error');
    next();
})

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

const PORT = process.env.Port || 5000;

app.listen(PORT,console.log(`Server started at port: ${PORT}`));