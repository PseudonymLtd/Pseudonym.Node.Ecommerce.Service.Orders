const path = require('path');

const Framework = require('pseudonym.node.ecommerce.library.framework');
const OrdersController = require('./controllers/orders');
const PaymentsController = require('./controllers/payments');

const serviceRunner = new Framework.Service.Runner('Orders Service');

serviceRunner.RegisterInfoHealthCheck(new Framework.Service.FileSystemAccessHealthCheck([
    __dirname,
    path.join(__dirname, 'data', 'orders')
]));

serviceRunner.RegisterController('/api', new PaymentsController());
serviceRunner.RegisterController('/api', new OrdersController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.app.authenticator.Logout(request, err => {
        if (err) {
            request.app.logger.warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.app.logger.info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.Start(3002);