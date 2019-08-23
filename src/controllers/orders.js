const Framework = require('library.ecommerce.framework');
const Order = require('../models/order');

module.exports = class OrdersController extends Framework.Service.Controller {
    constructor() {
        super('Orders Controller');

        this.Get('/orders', (request, response, next) => {
            response.Ok("OK");
        });
    }
}