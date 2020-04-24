import productAdapter from '@/client/adapters/product';
import client from '@/client/product';
import { generate } from '@/utils/testing';

import suite from './_suite';

suite('Client - Product', ({ expect, stubFetch, stubAdapter, expectCall }) => {
  const versionID = generate.id();
  const productID = generate.id();

  describe('get()', () => {
    it('should get a product by ID', async () => {
      const product: any = generate.object();
      const fetch = stubFetch().resolves(product);

      await expectCall(client.get, versionID, productID).toYield(product);

      expect(fetch).to.be.calledWithExactly(`skill/${versionID}/product/${productID}`);
    });
  });

  describe('create()', () => {
    it('should create a new product', async () => {
      const product: any = generate.object();
      const [dbProduct, toDB] = stubAdapter(productAdapter, 'toDB');
      const fetch = stubFetch('post');

      await expectCall(client.create, product).toYield();

      expect(toDB).to.be.calledWithExactly(product);
      expect(fetch).to.be.calledWithExactly('skill/product?new=1', dbProduct);
    });
  });

  describe('update()', () => {
    it('should update a product', async () => {
      const product: any = generate.object();
      const [dbProduct, toDB] = stubAdapter(productAdapter, 'toDB');
      const fetch = stubFetch('post');

      await expectCall(client.update, product).toYield();

      expect(toDB).to.be.calledWithExactly(product);
      expect(fetch).to.be.calledWithExactly('skill/product', dbProduct);
    });
  });

  describe('copy()', () => {
    it('should copy a product by ID', async () => {
      const product: any = generate.object();
      const fetch = stubFetch('post').resolves(product);

      await expectCall(client.copy, versionID, productID).withAdapter(productAdapter, product).toYield();

      expect(fetch).to.be.calledWithExactly(`skill/${versionID}/product/${productID}/copy`);
    });
  });

  describe('delete()', () => {
    it('should delete a product by ID', async () => {
      const fetch = stubFetch('delete');

      await expectCall(client.delete, versionID, productID).toYield();

      expect(fetch).to.be.calledWithExactly(`skill/${versionID}/product/${productID}`);
    });
  });

  describe('findProducts()', () => {
    it('should find all products for a version', async () => {
      const products: any[] = generate.array(3, generate.object);
      const fetch = stubFetch().resolves(products);

      await expectCall(client.findProducts, versionID).withListAdapter(productAdapter, products).toYield();

      expect(fetch).to.be.calledWithExactly(`skill/${versionID}/products`);
    });
  });
});
