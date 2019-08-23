const Framework = require('library.ecommerce.framework');
const dataStore = new Framework.Data.FileDataStore('orders');

const vatPercentage = 20.00;

module.exports = class Order extends Framework.Models.DataModel
{
    constructor(items) {
        super()
        this.items = [...items];
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

    set PostalService(value) {
        return this.postalService = value;
    }

    get Total() {
        return this.SubTotal + this.VAT + this.postalService.Price;
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
        return dataStore.FetchAll(Order.Mapper, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(id, Order.Mapper, callback);
    }

    static Mapper(rawJson) {
        const p = JSON.parse(rawJson);
        const product = new Product(p.name, p.description, p.price, p.imageUri);
        product.Id = p.id;
        return product;
    }
}