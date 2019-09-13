module.exports = class OrderItem
{
    constructor(productId, productName, quantity, pricePerItem) {
        this._productId = productId;
        this._productName = productName;
        this._quantity = parseInt(quantity);
        this._pricePerItem = parseFloat(pricePerItem);
    }

    get ProductId() {
        return this._productId;
    }

    get ProductName() {
        return this._productName;
    }

    get Quantity() {
        return this._quantity;
    }

    get PricePerItem() {
        return this._pricePerItem;
    }

    get Total() {
        return this.PricePerItem * this.Quantity;
    }
}