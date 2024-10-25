'use strict';

const LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
const TestServiceDefinition = require('*/cartridge/scripts/services/testServiceDefinition.js');

const TEST_SERVICE_ID = 'cartridge_test.http.service.get';


/**
 * Service definition to retrieve all products from custom API.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getAllProducts = (prodId) => {
    const config = TestServiceDefinition.AllProducts;
    const ProductsService = LocalServiceRegistry.createService(TEST_SERVICE_ID, config);
    let endpoint = prodId ? `/products/${prodId}` : '/products' 
    return ProductsService.call({
        endpoint : endpoint,
        params : {
            limit : 5
        }
    });
};


/**
 * Service definition to retrieve all products from a specific category
 * @param {string} categoryName - Category name to retrieve data from.
 * @returns {dw.svc.Service} Service with desired data.
 */
const getProductsByCategoryName = (categoryName) => {
    const config = TestServiceDefinition.AllProductsByCategory;
    const CategoriesService = LocalServiceRegistry.createService(TEST_SERVICE_ID, config);

    return CategoriesService.call({
        endpoint : '/products/category/' + categoryName,
        params : {
            limit : 5,
            sort: 'asc'
        }
    });
};

module.exports = {
    getAllProducts : getAllProducts,
    getProductsByCategoryName : getProductsByCategoryName,
};
