require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = process.env.PORT || 3000;
const apiRouter = require('./routes/api');
const geoRouter = require('./routes/geo');

// Database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) console.log(err);
    console.log('Database connected!');
});

// Middlewares
app.use(morgan('dev'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.redirect('/geo'));
app.use('/geo', geoRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});