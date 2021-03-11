require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const appService = require('./services/appService');

// Database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) console.log(err);
    console.log('Database connected!');
});

// Middlewares
app.use(morgan('dev'));

// Routes
app.get('/getData', (req, res) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    res.send(appService.getData(ip));
});
// app.get('/getData/:ip', (req, res) => {
//     res.send(appService.getData(req.params.ip));
// });

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});