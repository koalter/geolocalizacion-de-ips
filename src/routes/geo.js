const express = require('express');
const router = express.Router();
const fetch = require('node-fetch').default;

router.get('/', (req, res) => res.render('geo'));

router.post('/', async (req, res) => {
    const sections = [req.body['section_1'], req.body['section_2'], req.body['section_3'], req.body['section_4']];
    let errors = [];
    let ip = '';

    for (let i = 0; i < sections.length; i++) {
        const intSection = parseInt(sections[i]);
        if (isNaN(intSection) || intSection > 255 || intSection < 0) {
            res.render('geo', { message: '¡Datos inválidos!' });
        } else {
            ip += sections[i];
            if (i < sections.length - 1) {
                ip += '.';
            }
        }
    }

    const result = await fetch(`${req.protocol}://${req.get('host')}/api/getDataTest/${ip}`);
    console.log(await result.json());
    res.render('geo', { message: '¡Datos enviados correctamente!' });
});

module.exports = router;