const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports = class PaymentsController extends Framework.Service.Controller {
    constructor() {
        super('Payments Controller');

        this.Get('/Vat', (request, response, next) => {
            request.Environment.ConfigurationManager.ReadValue('VatInfo', (data, err) => {
                if (err) {
                    return next(err);
                }
                else {
                    return response.Ok(data);
                }
            });
        });
    }
}