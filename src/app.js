const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const apiRoutes = require('./routes');
const Logger= require('./util/logging');
const serviceResponse = require('./models/serviceResponse');

const logger = new Logger('Service');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use((request, response, next) =>
{
    logger.debug(`Request Recieved: ${request.url}`);
    next();
});

app.use('/api', apiRoutes);

app.use((error, request, response, next) =>
{
    if (error !== null && error !== undefined) {
        logger.error(`500 Internal Server Error: ${request.url}`);
        console.error(error);

        response.status(500);

        return response.send(serviceResponse.InternalServerError(error, { requestedUri: request.url }));
    }
    else {
        next();
    }
});

app.use((request, response, next) =>
{
    logger.warn(`404 Not found:\r\n${request.url}`);

    response.status(404);

    response.send(serviceResponse.NotFound());
});

app.listen(3002);