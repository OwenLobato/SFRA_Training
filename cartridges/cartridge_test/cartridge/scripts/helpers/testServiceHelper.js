'use strict';

/**
 * Transform date into an instance timezone date.
 * @param {Date} date - GMT date
 * @returns {Date} Date in same timezone as the configured in current instance.
 */
const formatDate = (date) => {
    const Calendar = require('dw/util/Calendar');
    const System = require('dw/system/System');
    const currentTimeZone = System.instanceTimeZone;

    const timeZoneDate = new Calendar(date);
    timeZoneDate.setTimeZone(currentTimeZone);

    return timeZoneDate;
};

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
            date : formatDate(new Date()),
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

/**
 * Retrieve all products from API
 * @param {string} categoryName - Category name
 * @returns {object} with the desired data and success property
 */
const retrieveAllProductsByCategory = (categoryName) => {
    return getServiceResponse('getProductsByCategoryName', {
        callback: (response) => {
            if(!empty(response.success)) {

            }
        },
        id: categoryName
    });
    
};

module.exports = {
    getServiceResponse : getServiceResponse,
    retrieveAllProducts : retrieveAllProducts,
    retrieveAllProductsByCategory : retrieveAllProductsByCategory,
    formatDate: formatDate,
};
