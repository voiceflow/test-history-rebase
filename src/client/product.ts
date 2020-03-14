import { DBProduct, Product } from '@/models';

import productAdapter from './adapters/product';
import fetch from './fetch';

const productClient = {
  get: (versionID: string, productID: string) => fetch.get<DBProduct>(`skill/${versionID}/product/${productID}`),

  create: (product: Product) => fetch.post('skill/product?new=1', productAdapter.toDB(product)),

  update: (product: Product) => fetch.post('skill/product', productAdapter.toDB(product)),

  copy: (versionID: string, productID: string) => fetch.post<DBProduct>(`skill/${versionID}/product/${productID}/copy`).then(productAdapter.fromDB),

  delete: (versionID: string, productID: string) => fetch.delete(`skill/${versionID}/product/${productID}`),

  findProducts: (versionID: string) => fetch.get<DBProduct[]>(`skill/${versionID}/products`).then(productAdapter.mapFromDB),
};

export default productClient;
