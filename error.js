export default class Error {
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
    print() {
        console.log('FAILED');
        console.log('Status:', this.status);
        console.log('Error: ', this.error);
    }
}