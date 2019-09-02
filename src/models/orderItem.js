module.exports = class OrderItem
{
    constructor(productId, quantity, pricePerItem) {
        this.productId = parseInt(productId);
        this.quantity = parseInt(quantity);
        this.pricePerItem = parseFloat(pricePerItem);
    }

    get ProductId() {
        return this.productId;
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