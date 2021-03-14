const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;

router.get('/', (req, res) => res.render('queries'));

router.get('/longest', async (req, res) => {
    const result = await fetch(`${req.protocol}://${req.get('host')}/api/getLongest`);
    let output = null;
    if (result.status === 200) {
        output = await result.json();
        console.log(output);
    }

    const options = {
        status: result.status,
        output: output
    }

    res.status(result.status).render('queries', options);
});
router.get('/shortest', async (req, res) => {
    const result = await fetch(`${req.protocol}://${req.get('host')}/api/getShortest`);
    let output = null;
    if (result.status === 200) {
        output = await result.json();
        console.log(output);
    }

    const options = {
        status: result.status,
        output: output
    }
    
    res.status(result.status).render('queries', options);
});
router.get('/average', async (req, res) => {
    const result = await fetch(`${req.protocol}://${req.get('host')}/api/getAverage`);
});

module.exports = router;