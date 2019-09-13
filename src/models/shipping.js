const Framework = require('pseudonym.node.ecommerce.library.framework');
const collectionName = 'Shipping';

module.exports = class Shipping extends Framework.Models.DataModel
{
    constructor(name, window, price, id) {
        super(id);
        this._name = name;
        this._window = window;
        this._price = parseFloat(price);
    }

    get Name() {
        return this._name;
    }

    set Name(value) {
        return this._name = value;
    }

    get Window() {
        return this._window;
    }

    set Window(value) {
        return this._window = value;
    }

    get Price() {
        return this._price;
    }

    set Price(value) {
        return this._price = parseFloat(value);
    }

    static Map(dataObj) {
        return new Shipping(dataObj._name, dataObj._window, dataObj._price, dataObj._id.toString());
    }

    static get CollectionName() {
        return collectionName;
    }

    get CollectionName() {
        return collectionName;
    }
}