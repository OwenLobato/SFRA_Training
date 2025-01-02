'use strict';

/**
 * Middleware to check if the instance is not production to allow continue the middleware chain.
 *
 * @param {dw.system.Request} req - The request object.
 * @param {dw.system.Response} res - The response object.
 * @param {Function} next - The next function in the middleware chain.
 */
const isSecondaryInstanceGroup = (req, res, next) => {
    const System = require('dw/system/System');
    const URLUtils = require('dw/web/URLUtils');

    if(System.getInstanceType() == System.PRODUCTION_SYSTEM) {
        res.redirect(URLUtils.https('Home-Show').toString());
        return next();
    }

    next();
};

module.exports = {
    isSecondaryInstanceGroup : isSecondaryInstanceGroup
};