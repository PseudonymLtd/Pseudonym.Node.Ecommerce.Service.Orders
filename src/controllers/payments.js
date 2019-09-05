const Framework = require('pseudonym.node.ecommerce.library.framework');
const vatRates = require('../data/vat');

module.exports = class PaymentsController extends Framework.Service.Controller {
    constructor() {
        super('Payments Controller');

        this.Get('/Vat', (request, response, next) => {
            response.Ok(vatRates);
        });
    }
}