'use strict';

const Status = require('dw/system/Status');
const success = new Status(Status.OK);

// API https://fakestoreapi.com/docs

/**
 * Service Callbacks for AllProducts API request.
 */
const AllProducts = {
    createRequest : (service, parameters) => {
        service.setRequestMethod('GET');
        service.setURL(service.getURL() + parameters.endpoint);

        service.addParam('limit', parameters.params.limit);
    },
    parseResponse: (service, response) => {
        if(response.statusMessage == success.message) {
            try {
                const serviceResponse = JSON.parse(response.text);
                const result = {
                    success : true,
                    data: serviceResponse
                };

                return result;
            } catch(error) {
                // Log error message and do something
                return { success : false};
            }
        } else {
            // Log error message and do something
            return { success : false};
        }
    }
};

module.exports = {
    AllProducts : AllProducts,
};