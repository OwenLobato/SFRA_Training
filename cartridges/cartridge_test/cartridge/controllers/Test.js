'use strict';

/**
 * @namespace Test
 */

var server = require('server');
server.extend(module.superModule);

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

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
server.replace(
    'Show',
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        var Site = require('dw/system/Site');
        var PageMgr = require('dw/experience/PageMgr');
        var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

        pageMetaHelper.setPageMetaTags(req.pageMetaData, Site.current);

        var page = PageMgr.getPage('test-store');

        if (page && page.isVisible()) {
            res.page('test-store');
        } else {
            res.render('sections/testShow', { name: 'Owen Lobato' });
        }
        next();
    },
    pageMetaData.computedPageMetaData
);

server.get('Service', function (req, res, next) {
    var testServiceHelper = require('*/cartridge/scripts/helpers/testServiceHelper');

    var category = 'jewelery'

    var serviceData1 = testServiceHelper.retrieveAllProducts();
    var serviceData2 = testServiceHelper.retrieveAllProductsByCategory(category);


    res.render('sections/testService', {
        category: category,
        data1: serviceData1,
        data2: serviceData2
    });

    next();
});

module.exports = server.exports();
