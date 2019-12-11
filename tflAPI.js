import BusStop from './busStop.js';
import req from 'request';
import Error from './error.js'


export default class TflAPI {
    constructor() {}

    static getBusID(loc) {
        const IDURL = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + loc.lat + "&lon=" + loc.lon + "&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0";
        return new Promise((resolve, reject) => {
            req(IDURL, function (error, response, body) {

                const body_parsed = JSON.parse(body);

                if (response.statusCode !== 200) {
                    reject(new Error(response.statusCode, response.statusMessage));
                } else if (body_parsed.stopPoints.length === 0) {
                    reject(new Error(404, 'No Nearby Busstop'));
                } else {
                    const ids = body_parsed.stopPoints.slice(0, 2).map(x => x.id);
                    resolve(ids);
                }

            });
        });
    }

    static getNextBuses(ids) {

        let count = 0;
        let busStopList = [];

        return new Promise((resolve, reject) => {

            ids.forEach(id => {

                const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

                req(BUSURL, function (error, response, body) {

                    const body_arr = JSON.parse(body);

                    if (response.statusCode !== 200) {
                        reject(new Error(response.statusCode, response.statusMessage));
                    } else {
                        let busStop = BusStop.makeStop(id, body_arr);
                        busStopList.push(busStop);
                        if (++count === ids.length) {
                            resolve(busStopList);
                        }
                    }
                });
            });
        });
    }
}