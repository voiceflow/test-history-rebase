import productAdapter from './adapters/product';
import fetch from './fetch';

const productClient = {
  get: (versionID, productID) => fetch.get(`skill/${versionID}/product/${productID}`),

  create: (product) => fetch.post('skill/product?new=1', productAdapter.toDB(product)),

  update: (product) => fetch.post('skill/product', productAdapter.toDB(product)),

  copy: (versionID, productID) => fetch.post(`skill/${versionID}/product/${productID}/copy`).then(productAdapter.fromDB),

  delete: (versionID, productID) => fetch.delete(`skill/${versionID}/product/${productID}`),

  findProducts: (versionID) => fetch.get(`skill/${versionID}/products`).then(productAdapter.mapFromDB),
};

export default productClient;
