import rl from 'readline-sync';
import req from 'request';

//const POSTCODE = rl.question("Please enter a postcode: ")
//const CODE = rl.question("Please enter a bus code: ");
const CODE = '490010654S';
const POSTCODE = 'NW51TL'

function getLoc(postcode, successCallback) {
    const POSTURL = 'http://api.postcodes.io/postcodes/' + postcode;

    req(POSTURL, function (error, response, body) {

        const body_parsed = JSON.parse(body)

        const lon = body_parsed.result.longitude;
        const lat = body_parsed.result.latitude;

        successCallback({
            lat: lat,
            lon: lon
        });
    });
}

getLoc(POSTCODE, function (loc) {
    getBusID(loc, function (ids) {
        //console.log(ids);
        getNextBuses(ids);
    });
});


function getBusID(loc, successCallback) {
    const IDURL = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + loc.lat + "&lon=" + loc.lon + "&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0"
    req(IDURL, function (error, response, body) {

        const body_parsed = JSON.parse(body);
        const ids = body_parsed.stopPoints.slice(0, 2).map(x => x.id);

        successCallback(ids);
    });
}



function getNextBuses(ids) {

    for (let j = 0; j < 2; j++) {
        const CODE = ids[j];
        //console.log('Bus stop id:',CODE);
        const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + CODE + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

        req(BUSURL, function (error, response, body) {

            let body_arr = JSON.parse(body)
            body_arr.sort(function (a, b) {
                return new Date(a.expectedArrival) - new Date(b.expectedArrival);
            })
            let arr = body_arr.slice(0, 5);
            for (let i = 0; i < 5; i++) {
                console.log('Bus stop id:',CODE);
                console.log('lineName:', arr[i].lineName);
                console.log('destinationName:', arr[i].destinationName);
                console.log('expectedArrival:', arr[i].expectedArrival);
            }
        });
    }
}