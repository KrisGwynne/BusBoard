import rl from 'readline-sync';
import req from 'request';

//const POSTCODE = rl.question("Please enter a postcode: ")
//const CODE = rl.question("Please enter a bus code: ");
const CODE = '490010654S';
const POSTCODE = 'N44EB'


function getLoc(postcode, successCallback) {
    const POSTURL = 'http://api.postcodes.io/postcodes/' + postcode;
    
    req(POSTURL, function (error, response, body) {
    
        const body_parsed = JSON.parse(body)
    
        const lon = body_parsed.result.longitude;
        const lat = body_parsed.result.latitude;
    
        successCallback({lon: lon, lat:lat});
    });
}

getLoc(POSTCODE, function (loc) {
    console.log(loc.lat);
});

//https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=51.574721&lon=-0.113486&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0


// const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + CODE + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

// req(BUSURL, function (error, response, body) {

//     let body_arr = JSON.parse(body)
//     body_arr.sort(function (a, b) {
//         return new Date(a.expectedArrival) - new Date(b.expectedArrival);
//     })
//     let arr = body_arr.slice(0, 5);
//     for (let i = 0; i < 5; i++) {
//         console.log('lineName:', arr[i].lineName);
//         console.log('destinationName:', arr[i].destinationName);
//         console.log('expectedArrival:', arr[i].expectedArrival);
//     }
// });