import rl from 'readline-sync';
import req from 'request';

class Bus {
    constructor(line, dest, arrival){
        this.line = line;
        this.destination = dest;
        this.arrival = arrival;
    }
    print() {
        console.log('line: ', this.line);
        console.log('destination: ', this.destination);
        console.log('arrival time: ', this.arrival);
        
    }
}

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


function getBusID(loc, successCallback) {
    const IDURL = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + loc.lat + "&lon=" + loc.lon + "&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0"
    req(IDURL, function (error, response, body) {

        const body_parsed = JSON.parse(body);
        const ids = body_parsed.stopPoints.slice(0, 2).map(x => x.id);

        successCallback(ids);
    });
}



function getNextBuses(ids, successCallback) {

    let count = 0;
    let busstop = [];

    ids.forEach(id => {

        buses = [];

        const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

        req(BUSURL, function (error, response, body) {

            let body_arr = JSON.parse(body);
            body_arr.sort(function (a, b) {
                return new Date(a.expectedArrival) - new Date(b.expectedArrival);
            })
            let arr = body_arr.slice(0, 5);
            for (let i = 0; i < 5; i++) {

                buses.push(new Bus(arr[i].lineName,arr[i].destinationName,arr[i].expectedArrival));
                
            }

            busstop.push(buses);

            if (++count === 2) {

                successCallback(busstop);
            }
        });
    });
}


getLoc(POSTCODE, function (loc) {
    getBusID(loc, function (ids) {
        //console.log(ids);
        getNextBuses(ids, function (busstop){
            console.log(busstop);
            
        });
    });
});