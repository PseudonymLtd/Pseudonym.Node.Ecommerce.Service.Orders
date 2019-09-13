const Framework = require('pseudonym.node.ecommerce.library.framework');
const OrderItem = require('./orderItem');
const collectionName = 'Orders';

const PendingState = 'Pending';
const AbandonedState = 'Abandoned';
const CancelledState = 'Cancelled';
const CompletedState = 'Completed';

module.exports = class Order extends Framework.Models.DataModel
{
    constructor(items, shipping, vatInfo, status, id) {
        super(id)
        this._items = [...items];
        this._shipping = shipping;
        this._vatInfo = vatInfo;
        this._status = status ? status : PendingState;
    }

    get Status() {
        return this._status;
    }

    set Status(value) {
        return this._status = value;
    }

    get Items() {
        return this._items;
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this._items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get VAT() {
        return this.SubTotal * (this._vatInfo.Rate / 100);
    }

    get Shipping() {
        return this._shipping;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.Shipping.Price;
    }

    get VatInfo() {
        return this._vatInfo;
    }

    static Map(dataObj) {
        return new Order(
            dataObj._items.map(o => new OrderItem(o._productId, o._productName, o._quantity, o._pricePerItem)),
            dataObj._shipping,
            dataObj._vatInfo,
            dataObj._status,
            dataObj._id.toString());
    }

    static get CollectionName() {
        return collectionName;
    }

    get CollectionName() {
        return collectionName;
    }

    static get PendingState() {
        return PendingState;
    }

    static get AbandonedState() {
        return AbandonedState;
    }

    static get CancelledState() {
        return CancelledState;
    }

    static get CompletedState() {
        return CompletedState;
    }
}