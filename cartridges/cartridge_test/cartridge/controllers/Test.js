'use strict';

/**
 * @namespace Test
 */

var server = require('server');

/**
 * Test-Show : The Test-Show endpoint will render the shopper's test page. Once a shopper logs in they will see is a dashboard that displays profile, address, payment and order information.
 * @name Base/Test-Show
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {querystringparameter} - registration - A flag determining whether or not this is a newly registered test
 * @param {category} - senstive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.get('Show', server.middleware.https, function (req, res, next) {
    var name = 'Owen Lobato';
    res.render('sections/testShow', { name: name });
    next();
});

module.exports = server.exports();
