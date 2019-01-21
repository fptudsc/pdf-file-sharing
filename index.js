require('dotenv').config();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>');
});

const PORT = process.env.PORT;
const server = app.listen(PORT, function () {
    console.log(`Server is now running on http://localhost:${server.address().port}`);
});