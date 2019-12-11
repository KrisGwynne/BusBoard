import rl from 'readline-sync';
import PostcodeAPI from './postcodeAPI.js';
import TflAPI from './tflAPI.js';

//const POSTCODE = rl.question("Please enter a postcode: ")
//const CODE = rl.question("Please enter a bus code: ");
//const CODE = '490010654S';
const POSTCODE = 'N44EB'

PostcodeAPI.getLoc(
    POSTCODE,
    function (loc) {
        TflAPI.getBusID(
            loc,
            function (ids) {
                TflAPI.getNextBuses(
                    ids,
                    function (busStopList) {
                        busStopList.forEach(x => x.print());
                    },
                    function (error) {
                        error.print();
                    });
            },
            function (error) {
                error.print()
            });
    },
    function (error) {
        error.print()
    }
);