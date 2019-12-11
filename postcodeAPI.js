import req from 'request';
import Error from './error.js'

export default class PostcodeAPI {
    constructor() {}

    static getLoc(postcode, successCallback, errorCallback) {
        const POSTURL = 'http://api.postcodes.io/postcodes/' + postcode;

        req(POSTURL, function (error, response, body) {

            const body_parsed = JSON.parse(body)

            if (body_parsed.status !== 200) {
                errorCallback(new Error(body_parsed.status, body_parsed.error))
            } else {

                const lon = body_parsed.result.longitude;
                const lat = body_parsed.result.latitude;

                successCallback({
                    lat: lat,
                    lon: lon
                });
            }


        });
    }
}