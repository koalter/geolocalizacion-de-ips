const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const apiRouter = require('./routes/api');

// Database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) console.log(err);
    console.log('Database connected!');
});

// Middlewares
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});