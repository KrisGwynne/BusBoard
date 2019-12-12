import BusStop from './busStop.js';
import req from 'request';
import Error from './error.js'


export default class TflAPI {
    constructor() {}

    static getBusStopID(loc) {
        const IDURL = "https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + loc.lat + "&lon=" + loc.lon + "&app_key=2009c17b754eb17339154258424cfdca&app_id=ee46d9e0";
        return new Promise((resolve, reject) => {
            req(IDURL, function (error, response, body) {

                const body_parsed = JSON.parse(body);

                if (response.statusCode !== 200) {
                    reject(new Error(response.statusCode, response.statusMessage));
                } else if (body_parsed.stopPoints.length === 0) {
                    reject(new Error(404, 'No Nearby Busstop'));
                } else {
                    resolve(body_parsed.stopPoints.slice(0,2).map(x => {return {
                        commonName: x.commonName,
                        id: x.id
                    }}))
                }
            });
        });
    }

    static getNextBuses(stops) {

        const promiseList = [];

        stops.forEach(stop => {

            promiseList.push(new Promise((resolve, reject) => {
                const BUSURL = 'https://api.tfl.gov.uk/StopPoint/' + stop.id + '/Arrivals?app_id=ee46d9e0&app_key=2009c17b754eb17339154258424cfdca';

                req(BUSURL, function (error, response, body) {

                    const body_arr = JSON.parse(body);

                    if (response.statusCode !== 200) {
                        reject(new Error(response.statusCode, response.statusMessage));
                    } else {
                        resolve(BusStop.makeStop(stop.commonName, stop.id, body_arr, 5));
                    }
                });
            }))
        });

        return Promise.all(promiseList);
    }
}