import rl from 'readline-sync';
import req from 'request';

class Bus {
    constructor(line, dest, arrival) {
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

class BusStop {
    constructor(id, busArray) {
        this.id = id;
        this.arrivals = busArray;
    }

    print() {
        console.log('id: ', this.id);
        console.log('arrivals: ', this.arrivals);
    }

    static makeStop(id, parsedBuses, numBuses) {

        parsedBuses.sort(function (a, b) {
            return new Date(a.expectedArrival) - new Date(b.expectedArrival);
        })

        parsedBuses = parsedBuses.slice(0, numBuses).map(x => new Bus(x.lineName, x.destinationName, x.expectedArrival));
        return new BusStop(id, parsedBuses);
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
    let busStopList = [];

    ids.forEach(id => {

        const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

        req(BUSURL, function (error, response, body) {

            const body_arr = JSON.parse(body);
            let busStop = BusStop.makeStop(id, body_arr);
            busStopList.push(busStop);

            if (++count === ids.length) {
                successCallback(busStopList);
            }
        });
    });
}


getLoc(POSTCODE, function (loc) {
    getBusID(loc, function (ids) {
        getNextBuses(ids, function (busStopList) {
            busStopList.forEach(x => x.print());
        });
    });
});