'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const TestServiceDefinition = require('*/cartridge/scripts/services/testServiceDefinition.js');

const TEST_SERVICE_ID = 'cartridge_test.http.service.get';


/**
 * Service definition to retrieve all products from custom API.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getAllProducts = () => {
    const config = TestServiceDefinition.AllProducts;
    const ProductsService = LocalServiceRegistry.createService(TEST_SERVICE_ID, config);
    return ProductsService.call({
        endpoint : '/products',
        params : {
            limit : 5
        }
    });
};

module.exports = {
    getAllProducts : getAllProducts,
};
