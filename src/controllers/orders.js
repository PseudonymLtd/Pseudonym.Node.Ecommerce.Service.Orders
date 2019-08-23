const Logger= require('../util/logging');
const serviceResponse = require('../models/serviceResponse');
const Order = require('../models/order');

const logger = new Logger('OrdersController');

module.exports.getOrders = (request, response, next) => {
    response.send(serviceResponse.Ok("OK"));
};