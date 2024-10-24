'use strict';

/**
 * Calls a service using Service Framework and if everything worked well, callback function is executed
 * with service response as a parameter.
 *
 * @param {string} method - Service exported method to execute.
 * @param {function} callback - Callback function to execute after service call.
 * @returns {Object} Object with formated data from Trust Status API.
 */
const getServiceResponse = (method, params) => {
    const Status = require('dw/system/Status');
    const TestService = require('*/cartridge/scripts/services/testService');
    const success = new Status(Status.OK);

    const serviceResponse = !empty(params.id) ? TestService[method](params.id) : TestService[method]();
    if(serviceResponse.msg == success.message) {
        const callbackResult = params.callback(serviceResponse.object);
        return {
            data : serviceResponse.object,
            callbackResult : callbackResult
        }
    }

    return {
        success : false
    };
}


/**
 * Retrieve the status information of B2C Commerce maintenances from a custom object 'B2CCommerceMaintenances'
 * if the information was saved less than an hour ago, and if not, make a request to the API, updating the
 * custom object immediately afterwards.
 * @returns {object} with the desired data and success property
 */
const retrieveAllProducts = () => {
    const CustomObjectMgr = require('dw/object/CustomObjectMgr');

    return getServiceResponse('getAllProducts', {
        callback: (response) => {
            if(!empty(response.success)) {
                return 'HOLA MUNDO'

            }
        }
    });
};

module.exports = {
    getServiceResponse : getServiceResponse,
    retrieveAllProducts : retrieveAllProducts,
};
