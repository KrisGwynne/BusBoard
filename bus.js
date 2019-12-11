export default class Bus {
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