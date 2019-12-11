import Bus from './bus.js'

export default class BusStop {
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