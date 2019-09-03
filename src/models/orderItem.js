module.exports = class OrderItem
{
    constructor(productId, productName, quantity, pricePerItem) {
        this.productId = parseInt(productId);
        this.productName = productName;
        this.quantity = parseInt(quantity);
        this.pricePerItem = parseFloat(pricePerItem);
    }

    get ProductId() {
        return this.productId;
    }

    get ProductName() {
        return this.productName;
    }

    get Quantity() {
        return this.quantity;
    }

    get PricePerItem() {
        return this.pricePerItem;
    }

    get Total() {
        return this.PricePerItem * this.Quantity;
    }
}