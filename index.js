import rl from 'readline-sync';
import PostcodeAPI from './postcodeAPI.js';
import TflAPI from './tflAPI.js';

//const POSTCODE = rl.question("Please enter a postcode: ")
//const CODE = rl.question("Please enter a bus code: ");
//const CODE = '490010654S';

const POSTCODES = ['N44EB', 'spioj', 'OX14JD'];
//const POSTCODE = 'N44EB'

POSTCODES.forEach(POSTCODE => {

    PostcodeAPI.getLoc(POSTCODE)
        .then(loc => TflAPI.getBusID(loc))
        .then(ids => TflAPI.getNextBuses(ids))
        .then(bsList => bsList.forEach(x => x.print()))
        .catch(err => err.print());
});


/*PostcodeAPI.getLoc(POSTCODE)
    .then(loc => TflAPI.getBusID(loc))
    .then(ids => TflAPI.getNextBuses(ids))
    .then(bsList => bsList.forEach(x => x.print()))
    .catch(err => err.print());
*/