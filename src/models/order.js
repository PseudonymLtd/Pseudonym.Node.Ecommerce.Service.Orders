const Framework = require('library.ecommerce.framework');
const dataStore = new Framework.Data.FileDataStore('orders');
const OrderItem = require('./orderItem');
const PendingState = 'Pending';
const AbandonedState = 'Abandoned';
const CancelledState = 'Cancelled';
const CompletedState = 'Completed';

module.exports = class Order extends Framework.Models.DataModel
{
    constructor(items, postalService, vatInfo) {
        super()
        this.items = [...items];
        this.postalService = postalService;
        this.vatInfo = vatInfo;
        this.status = PendingState;
    }

    get Status() {
        return this.status;
    }

    set Status(value) {
        return this.status = value;
    }

    get Items() {
        return this.items;
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get VAT() {
        return this.SubTotal * (this.vatInfo.Rate / 100);
    }

    get PostalService() {
        return this.postalService;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.PostalService.Price;
    }

    get VatInfo() {
        return this.vatInfo;
    }

    Delete(callback) {
        return dataStore.Delete(this.Id, callback);
    }

    Save(callback) {
        return dataStore.Save(this.Id, this, callback);
    }

    static FetchAll(callback) {
        return dataStore.FetchAll(Order.Map, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(id, Order.Map, callback);
    }

    static Map(rawJson) {
        const orderData = JSON.parse(rawJson);
        const order = new Order(orderData.items.map(o => new OrderItem(o.productId, o.productName, o.quantity, o.pricePerItem)), orderData.postalService, orderData.vatInfo);
        order.id = orderData.id;
        order.status = orderData.status;
        return order;
    }

    Complete(callback) {
        if (this.status !== CompletedState) {
            this.status = CompletedState;
            return this.Save(callback);
        }
        else {
            return callback(this, 'Order has already been completed.');
        }
    }

    Abandon(callback) {
        if (this.status !== AbandonedState) {
            this.status = AbandonedState;
            return this.Save(callback);
        }
        return callback(this);
    }

    Cancel(callback) {
        if (this.status !== CancelledState) {
            this.status = CancelledState;
            return this.Save(callback);
        }
        return callback(this);
    }
}