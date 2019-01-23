require('dotenv').config();

const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash');

const app = express();

// require model
require('./models/user.model');

const userRoute = require('./routes/user.route'),
    authRoute = require('./routes/auth.route');

const auth = require('./middlewares/auth.middleware');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true },  function (err) {
    if (err) return console.error(err);
    console.log('Connected to MongoDB');
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

require('./config/passport.config')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/users', auth.requireAuth, userRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT;
const server = app.listen(PORT, function () {
    console.log(`Server is now running on http://localhost:${server.address().port}`);
});