const Framework = require('library.ecommerce.framework');
const apiRoutes = require('./routes');

const serviceRunner = new Framework.Service.Runner('Orders Service');

serviceRunner.AddRouteSet('/api', apiRoutes);

serviceRunner.Start(3002);