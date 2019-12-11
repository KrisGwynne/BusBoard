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

        const promiseList = [];

        ids.forEach(id => {

            promiseList.push(new Promise((resolve, reject) => {
                const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

                req(BUSURL, function (error, response, body) {

                    const body_arr = JSON.parse(body);

                    if (response.statusCode !== 200) {
                        reject(new Error(response.statusCode, response.statusMessage));
                    } else {
                        resolve(BusStop.makeStop(id, body_arr));
                    }
                });
            }))
        });

        return Promise.all(promiseList);
    }
}