const Framework = require('library.ecommerce.framework');
const dataStore = new Framework.Data.FileDataStore('orders');
const OrderItem = require('./orderItem');

const vatPercentage = 20.00;

module.exports = class Order extends Framework.Models.DataModel
{
    constructor(items, postalService) {
        super()
        this.items = [...items];
        this.postalService = postalService;
    }

    get Items() {
        return this.items;
    }

    get SubTotal() {
        return this.IsEmpty ? 0 : this.items.map(p => p.Total).reduce((t, p) => t + p);
    }

    get VAT() {
        return this.SubTotal * (vatPercentage / 100);
    }

    get PostalService() {
        return this.postalService;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.PostalService.Price;
    }

    get VatPercentage() {
        return vatPercentage;
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
        const order = new Order(orderData.items.map(o => new OrderItem(o.productId, o.quantity, o.pricePerItem)), orderData.postalService);
        order.id = orderData.id;
        return order;
    }
}