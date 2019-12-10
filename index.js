import rl from 'readline-sync';
import req from 'request';

//const CODE = rl.question("Please enter a bus code: ");
const CODE = '490008660N';
const URL = 'https://api.tfl.gov.uk/StopPoint/' + CODE + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

req(URL, function (error, response, body) {
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); 
    let body_arr = JSON.parse(body)
    body_arr.sort(function (a, b) {
        return new Date(a.expectedArrival) - new Date(b.expectedArrival);
    })
    let arr = body_arr.slice(0, 5);
    for (let i = 0; i < 5; i++) {
        console.log('lineName:', arr[i].lineName);
        console.log('destinationName:', arr[i].destinationName);
        console.log('expectedArrival:', arr[i].expectedArrival);
    }
});