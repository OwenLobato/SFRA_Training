'use strict';

/**
 * @namespace Catalog
 */

var server = require('server');

/**
 * Catalog-Show : The Catalog-Show endpoint will render the shopper's Catalog page. Once a shopper logs in they will see is a dashboard that displays profile, address, payment and order information.
 * @name Base/Catalog-Show
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', function (req, res, next) {

    var option = req.querystring.option || '1'; 
    res.render('catalog/template', { option: option });
    next();
});

server.get('Magazine', function (req, res, next) {
    res.render('catalog/magazine', {});
    next();
});

module.exports = server.exports();
