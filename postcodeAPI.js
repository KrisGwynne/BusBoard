import req from 'request';
import Error from './error.js'

export default class PostcodeAPI {
    constructor() {}

    static getLoc(postcode) {
        const POSTURL = 'http://api.postcodes.io/postcodes/' + postcode;

        return new Promise((resolve, reject) => {

            req(POSTURL, function (error, response, body) {

                const body_parsed = JSON.parse(body)

                if (body_parsed.status !== 200) {
                    reject(new Error(body_parsed.status, body_parsed.error))
                } else {

                    const lon = body_parsed.result.longitude;
                    const lat = body_parsed.result.latitude;

                    resolve({
                        lat: lat,
                        lon: lon
                    });
                }
            });
        });
    }
}