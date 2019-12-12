import rl from 'readline-sync';
import PostcodeAPI from './postcodeAPI.js';
import TflAPI from './tflAPI.js';
import express from 'express';

//const CODE = '490010654S';
//const POSTCODES = ['N44EB', 'spioj', 'OX14JD'];

const app = express();
const port = 2002;

app.get('/postcode/:postcode', function (req, res) {

    const POSTCODE = req.params.postcode;

    PostcodeAPI.getLoc(POSTCODE)
        .then(loc => TflAPI.getBusID(loc))
        .then(ids => TflAPI.getNextBuses(ids))
        .then(bsList => res.json(bsList))
        .catch(err => res.json(err));

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));