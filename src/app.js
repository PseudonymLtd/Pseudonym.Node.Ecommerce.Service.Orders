const Framework = require('library.ecommerce.framework');
const OrdersController = require('./controllers/orders');
const PaymentsController = require('./controllers/payments');
const ShippingController = require('./controllers/shipping');

const serviceRunner = new Framework.Service.Runner('Orders Service');

serviceRunner.RegisterController('/api', new PaymentsController());
serviceRunner.RegisterController('/api', new ShippingController());
serviceRunner.RegisterController('/api', new OrdersController());

serviceRunner.Start(3002);