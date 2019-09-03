const Framework = require('library.ecommerce.framework');
const postalServices = require('../data/shipping');

module.exports = class ShippingController extends Framework.Service.Controller {
    constructor() {
        super('Shipping Controller');

        this.Get('/Shipping', (request, response, next) => {
            response.Ok(postalServices);
        });
    }
}