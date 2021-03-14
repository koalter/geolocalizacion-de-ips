const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;

router.get('/', (req, res) => res.render('geo'));

router.post('/', async (req, res) => {
    const result = await fetch(`${req.protocol}://${req.get('host')}/api/getDataTest/${req.body['section_1']}.${req.body['section_2']}.${req.body['section_3']}.${req.body['section_4']}`);
    if (result.status === 200) console.log(await result.json());
    const options = {
        status: result.status,
        message: result.status === 200 ? '¡Datos enviados correctamente!' : '¡Datos inválidos!'
    }
    res.status(result.status).render('geo', options);
});

module.exports = router;