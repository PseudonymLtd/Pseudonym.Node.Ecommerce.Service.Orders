const Framework = require('pseudonym.node.ecommerce.library.framework');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const postalServices = require('../data/shipping');

module.exports = class OrdersController extends Framework.Service.Controller {
    constructor() {
        super('Orders Controller');

        //lists all the orders in the system.
        this.Get('/orders', (request, response, next) => {
            Order.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        //lists the specific order based on the id present in the path.
        this.Get('/order/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Order.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        //lists all the orders specified by the ids present in the body.
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

        //creates a new order
        this.Post('/order', (request, response, next) => {

            const postalServiceId = parseInt(request.body.postalServiceId);
            const postalService = postalServices.find(ps => ps.Id === postalServiceId);
            if (!postalService) { return response.BadRequest('Could not find a postal service that matches the Id provided.', { PostalServiceId: postalServiceId }); }
            
            const region = request.headers.region ? request.headers.region.toUpperCase() : 'GBR';
            request.Environment.ConfigurationManager.ReadValue('VatInfo', (vatRates, err) => {
                if (err) {
                    return next(err);
                }
                else {
                    const vatRate = vatRates.find(ps => ps.Region === region);
                    if (!vatRate) { return response.BadRequest('Could not find a vat rate that matches the region provided.', { Region: region }); }

                    var newOrder = new Order(
                        request.body.order.items.map(o => new OrderItem(o.product.id, o.product.name, o.quantity, o.product.price)),
                        postalService,
                        vatRate);

                    newOrder.Save((data, err) => {
                        if (err !== undefined) { return next(err); }
                
                        this.Logger.Info(`New order created:`);
                        console.info(newOrder);
                
                        return response.Ok(newOrder, {
                            total: newOrder.Total,
                            identifier: data.Id
                        });
                    });
                }
            });
        });

        //Updates the order
        this.Put('/order/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Order.Fetch(id, (order, err) => {
                if (err !== undefined) { return next(err); }

                order.Status = request.body.status;

                order.Save((data, err) => {
                    if (err !== undefined) { return next(err); }
            
                    this.Logger.Info('updated order:');
                    console.info(data);
            
                    return response.Ok(data);
                });
            });
        });

        //deletes and order
        this.Delete('/order/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            Order.Fetch(id, (order, err) => {
                if (err !== undefined) { return next(err); }
                
                order.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(order, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.Info(`removed order:`);
                        console.info(order);
        
                        return response.Ok(order);
                    }
                });
            });
        });
    }
}