module.exports = class DataModel
{
    constructor() {
        this.id = null;
    }

    get Id() {
        return this.id;
    }

    set Id(value) {
        return this.id = parseInt(value);
    }
}