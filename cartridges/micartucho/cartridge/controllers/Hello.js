'use strict';

/**
 * @namespace Hello
 */

var server = require('server');

/**
 * Hello-Show : The Hello-Show endpoint will render the shopper's Hello page. Once a shopper logs in they will see is a dashboard that displays profile, address, payment and order information.
 * @name Base/Hello-Show
 * @function
 * @memberof Hello
 * @param {middleware} - server.middleware.https
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {querystringparameter} - registration - A flag determining whether or not this is a newly registered Hello
 * @param {category} - senstive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */

server.get('Show', server.middleware.https, function (req, res, next) {
    res.render('training/hello.isml');
    next();
});

server.get('Remote', server.middleware.https, function (req, res, next) {
    var viewData = res.getViewData();
    var name = 'Owen';
    res.render('training/remoteInclude.isml', {
        name
    });
    next();
});


module.exports = server.exports();
