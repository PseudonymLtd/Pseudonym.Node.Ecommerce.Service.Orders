const Framework = require('library.ecommerce.framework');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

module.exports = class OrdersController extends Framework.Service.Controller {
    constructor() {
        super('Orders Controller');

        this.Get('/orders', (request, response, next) => {
            Order.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Get('/order/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Order.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Post('/orders', (request, response, next) => {
            const orderIds = request.body;
        
            if (orderIds.length === 0) { 
                return response.BadRequest('Body did not contain an product Ids.');
            }
            
            Order.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
        
                const filteredOrders = data.filter(p => orderIds.includes(p.Id));
                const unfoundIds = orderIds.filter(id => !filteredOrders.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(filteredOrders, unfoundIds.map(id => `No product was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(filteredOrders);
                }
            });
        });

        this.Put('/order', (request, response, next) => {
            console.log(request.body);
            var newOrder = new Order(request.body.items.map(o => new OrderItem(o.product.id, o.quantity, o.product.price)), request.body.postalService);

            newOrder.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.info(`New order receieved:`);
                console.info(newOrder);
        
                return response.Ok(newOrder, {
                    total: newOrder.Total,
                    identifier: data.Id
                });
            });
        });
    }
}