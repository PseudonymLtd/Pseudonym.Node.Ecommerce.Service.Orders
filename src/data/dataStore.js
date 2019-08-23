const fs = require('fs');
const path = require('path');
const Logger= require('../util/logging');

const logger = new Logger('DataStore');

module.exports = class DataStore {

    static Delete(dir, identifier, callback) {
        const deletePath = path.join(__dirname, dir, `${identifier}.json`);

        fs.exists(deletePath, (exists) => {
            if (!exists) {
                return callback(false);
            }
            else {
                fs.unlink(deletePath, (err) => {
                    if (err) { 
                        logger.fatal(err);
                        if (callback) {
                            return callback(true, err);
                        }
                    }
                    else {
                        return callback(true);
                    }
                });
            }
        });
    }

    static FetchAll(dir, mapper, callback) {
        const loadPath = path.join(__dirname, dir);
            
        logger.info(`Loading new data from disk: ${loadPath}\\*.json`);
        
        fs.readdir(loadPath, (err, files) => {
            if (err) { 
                logger.fatal(err);
                return callback(files, err);
            }
            else {
                const dataFiles = files.filter(f => f.toLowerCase().endsWith('.json'));

                const items = [];

                if (dataFiles.length === 0) {
                    return callback(items);
                }

                dataFiles.forEach(file => {
                    logger.info(`Processing: ${file}`);
                    fs.readFile(path.join(loadPath, file), (err, item) => {
                        if (err) { 
                            logger.fatal(err);
                            return callback(item, err); 
                        }
                        else {
                            items.push(item);
                        }

                        if (items.length === dataFiles.length) {
                            return callback(items.map(i => mapper(i)).sort((a, b) => a.Id - b.Id));
                        }
                    });
                });
            }
        });
    }

    static Fetch(dir, identifier, mapper, callback)
    {   
        const loadPath = path.join(__dirname, dir, `${identifier}.json`);

        logger.info(`Loading new data from disk: ${loadPath}`);

        fs.readFile(loadPath, (err, data) => {
            if (err) { 
                logger.fatal(err);
                return callback(data, err);
            }
            else {
                callback(mapper(data));
            }
        });
    }

    static Save(dir, identifier, data, callback)
    {   
        if (identifier === null) {
            this.FetchAll(dir, f => JSON.parse(f), (collection, err) => {
                if (err) {
                    logger.fatal(err);
                    return callback(collection, err);
                }

                data.Id = collection.length > 0 
                            ? collection.sort((a, b) => a.id > b.id)[collection.length - 1].id + 1 
                            : 1;

                const savePath = path.join(__dirname, dir, `${data.Id}.json`);

                logger.info(`Writing new data to disk: ${savePath}`);
        
                fs.writeFile(savePath, JSON.stringify(data), (err) => {
                    if (err) { 
                        logger.fatal(err);
                        return callback(data, err);
                    }
                    else {
                        callback(data);
                    }
                });
            });
        }
        else {
            const savePath = path.join(__dirname, dir, `${identifier}.json`);
        
            logger.info(`Writing updated data to disk: ${savePath}`);
    
            fs.writeFile(savePath, JSON.stringify(data), (err) => {
                if (err) { 
                    logger.fatal(err);
                    return callback(data, err);
                }
                else {
                    callback(data);
                }
            });
        }
    }
}