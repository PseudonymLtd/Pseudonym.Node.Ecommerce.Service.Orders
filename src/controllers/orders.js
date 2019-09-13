const Framework = require('pseudonym.node.ecommerce.library.framework');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Shipping = require('../models/shipping');

module.exports = class OrdersController extends Framework.Service.Controller {
    constructor() {
        super('Orders Controller');

        //lists all the orders in the system.
        this.Get('/orders', (request, response, next) => {
            Order.FetchAll((data, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    return response.Ok(data);
                }
            });
        });

        //lists the specific order based on the id present in the path.
        this.Get('/order/:id', (request, response, next) => {
            Order.FetchById(request.params.id, (data, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (data === null) {
                    return response.BadRequest(`An Order with an id of '${request.params.id}' does not exist in the database.`, {
                        suppliedId: request.params.id
                    });
                }
                else {
                    return response.Ok(data);
                }
            });
        });

        //lists all the orders specified by the ids present in the body.
        this.Post('/orders', (request, response, next) => {
            const orderIds = request.body;
        
            if (orderIds.length === 0) { 
                return response.BadRequest('Body did not contain any order Ids.');
            }
            
            Order.FetchByIds((orders, err) => {
                if (err !== undefined) { return next(err); }
        
                const unfoundIds = orderIds.filter(id => !orders.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(orders, unfoundIds.map(id => `No order was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(orders);
                }
            });
        });

        //creates a new order
        this.Post('/order', (request, response, next) => {
            return Shipping.FetchById(request.body.shippingId, (shipping, err) => {
                if (err !== undefined) { return next(err); }
                if (shipping === null) { return response.BadRequest('Could not find a shipping service that matches the Id provided.', { suppliedId: request.body.shippingId }); }
                
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
                            shipping,
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
        });

        //Updates the order
        this.Put('/order/:id', (request, response, next) => {
            Order.FetchById(request.params.id, (order, err) => {
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
            Order.FetchById(request.params.id, (order, err) => {
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