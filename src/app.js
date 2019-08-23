const Framework = require('library.ecommerce.framework');
const OrdersController = require('./controllers/orders');

const serviceRunner = new Framework.Service.Runner('Orders Service');

serviceRunner.RegisterController('/api', new OrdersController());

serviceRunner.Start(3002);