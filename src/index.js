const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;
const appService = require('./services/appService');

// Middlewares
app.use(morgan('dev'));

// Routes
app.get('/getData', (req, res) => {
    console.log(req.ip);
    res.send(appService.getData(req.ip));
});
app.get('/getData/:ip', (req, res) => {
    res.send(appService.getData(req.params.ip));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});