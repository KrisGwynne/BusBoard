import BusStop from './busStop.js';
import req from 'request';
import Error from './error.js'


export default class TflAPI {
    constructor() {}

    static getBusID(loc, successCallback,errorCallback) {
        const IDURL = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + loc.lat + "&lon=" + loc.lon + "&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0"
        req(IDURL, function (error, response, body) {

            const body_parsed = JSON.parse(body);

            if (response.statusCode !== 200) {
                errorCallback(new Error(response.statusCode, response.statusMessage));
            }

            
            if (body_parsed.stopPoints.length === 0) {
                errorCallback(new Error(404, 'No Nearby Busstop'));
            }

            const ids = body_parsed.stopPoints.slice(0, 2).map(x => x.id);

            successCallback(ids);
        });
    }

    static getNextBuses(ids, successCallback,errorCallback) {

        let count = 0;
        let busStopList = [];

        ids.forEach(id => {

            const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

            req(BUSURL, function (error, response, body) {

                const body_arr = JSON.parse(body);

                if (response.statusCode !== 200) {
                    errorCallback(new Error(response.statusCode, response.statusMessage));
                }
    
                let busStop = BusStop.makeStop(id, body_arr);
                busStopList.push(busStop);

                if (++count === ids.length) {
                    successCallback(busStopList);
                }
            });
        });
    }
}