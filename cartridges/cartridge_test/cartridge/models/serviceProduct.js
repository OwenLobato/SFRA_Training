
'use strict';

/* If product price is 100 or less, the product is free. */
var freeProduct = (price) => price <= 100 ? 0 : price;

/**
 * Product model
 */
module.exports = function (product) {
    this.id = product.id;
    this.title = product.title;
    this.price = freeProduct(product.price);
    this.description = product.description;
    this.category = product.category;
    this.image = product.image;
    this.rating  = product.rating;
};
