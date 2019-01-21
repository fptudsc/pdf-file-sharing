require('dotenv').config();

const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    path = require('path');

const app = express();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true },  function (err) {
    if (err) return console.error(err);
    console.log('Connected to MongoDB');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// require model
require('./models/user.model');

app.get('/', (req, res) => {
    res.render('index');
});

app.use('/users', require('./routes/user.route'));

const PORT = process.env.PORT;
const server = app.listen(PORT, function () {
    console.log(`Server is now running on http://localhost:${server.address().port}`);
});