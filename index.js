const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
// configure environment variables
const myEnv = dotenv.config();
// expand existing env variables
dotenvExpand(myEnv);

const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    debug = require('debug')('SERVER'),
    morgan = require('morgan'),
    passport = require('passport'),
    session = require('express-session'),
    flash = require('connect-flash'),
    cloudinary = require('cloudinary').v2;

const app = express();

// require model
require('./models/user.model');
require('./models/source.model');

const userRoute = require('./routes/user.route'),
    authRoute = require('./routes/auth.route'),
    sourceRoute = require('./routes/source.route');

const auth = require('./middlewares/auth.middleware'),
    requrestMiddleware = require('./middlewares/request.middleware');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 120000
    }
}));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

// connect to mlab cloud database
require('./config/mongodb.config').connectToMlab();
// configure cloudinary to upload file
require('./config/cloudinary.config')(cloudinary);
require('./config/passport.config')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// Wire request 'pre' actions
app.use(requrestMiddleware.wirePreRequest);

app.get('/', (req, res) => {
    res.render('index');
});

// using api
app.use('/api', auth.requireAuth, require('./api'));

app.use('/users', auth.requireAuth, userRoute);
app.use('/auth', authRoute);
app.use('/sources', sourceRoute);

// Since not found any middleware
app.use(requrestMiddleware.notFoundMiddleware);

// Wire request 'post' actions
// any error
app.use(requrestMiddleware.wirePostRequest);

const PORT = process.env.PORT;
const server = app.listen(PORT, function () {
    debug(`Server is now running on http://localhost:${server.address().port}`);
    debug('='.repeat(100));
});