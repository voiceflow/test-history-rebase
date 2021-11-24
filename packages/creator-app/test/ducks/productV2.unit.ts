/* eslint-disable mocha/no-identical-title */
import * as Alexa from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import { FeatureFlag } from '@/config/features';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Feature from '@/ducks/feature';
import * as ProductV1 from '@/ducks/product';
import { createNewProduct } from '@/ducks/product/utils';
import * as Product from '@/ducks/productV2';
import * as Session from '@/ducks/session';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const DIAGRAM_ID = 'diagramID';
const PRODUCT_ID = 'productID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const PRODUCT: Realtime.Product = {
  ...createNewProduct([Alexa.Constants.Locale.EN_AU, Alexa.Constants.Locale.DE_DE]),
  id: PRODUCT_ID,
  name: 'product',
};

const MOCK_STATE: Product.ProductState = {
  byKey: {
    [PRODUCT_ID]: PRODUCT,
    abc: {
      ...createNewProduct([Alexa.Constants.Locale.EN_AU, Alexa.Constants.Locale.DE_DE]),
      id: 'abc',
      name: 'alphabet product',
    },
  },
  allKeys: [PRODUCT_ID, 'abc'],
};

suite(Product, MOCK_STATE)('Ducks - Product V2', ({ expect, stub, describeEffectV2, createState }) => {
  const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

  describe('selectors', () => {
    describe('allProductsSelector()', () => {
      it('select all products from the legacy store', () => {
        const products = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Product.allProductsSelector(createState(MOCK_STATE, { [ProductV1.STATE_KEY]: Utils.normalized.normalize(products) }));

        expect(result).to.eql(products);
      });

      it('select all products', () => {
        const result = Product.allProductsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([PRODUCT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('productMapSelector()', () => {
      it('select product map from the legacy store', () => {
        const productState = Utils.normalized.normalize(Utils.generate.array(3, () => ({ id: Utils.generate.id() })));

        const result = Product.productMapSelector(createState(MOCK_STATE, { [ProductV1.STATE_KEY]: productState }));

        expect(result).to.eq(productState.byKey);
      });

      it('select product map', () => {
        const result = Product.productMapSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.byKey);
      });
    });

    describe('productByIDSelector()', () => {
      it('select product from the legacy store', () => {
        const product = { id: PRODUCT_ID };
        const productState = Utils.normalized.normalize([product]);

        const result = Product.productByIDSelector(createState(MOCK_STATE, { [ProductV1.STATE_KEY]: productState }), { id: PRODUCT_ID });

        expect(result).to.eq(product);
      });

      it('select known product', () => {
        const result = Product.productByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: PRODUCT_ID });

        expect(result).to.eq(PRODUCT);
      });

      it('select unknown product', () => {
        const result = Product.productByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getProductByIDSelector()', () => {
      it('select product from the legacy store', () => {
        const product = { id: PRODUCT_ID };
        const productState = Utils.normalized.normalize([product]);

        const result = Product.getProductByIDSelector(createState(MOCK_STATE, { [ProductV1.STATE_KEY]: productState }))(PRODUCT_ID);

        expect(result).to.eq(product);
      });

      it('select known product', () => {
        const result = Product.getProductByIDSelector(createState(MOCK_STATE, v2FeatureState))(PRODUCT_ID);

        expect(result).to.eq(PRODUCT);
      });

      it('select unknown product', () => {
        const result = Product.getProductByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });

    describe('productsByIDsSelector()', () => {
      it('select products from the legacy store', () => {
        const product = { id: DIAGRAM_ID };
        const otherProductID = 'foo';
        const otherProduct = { id: 'foo' };
        const productState = Utils.normalized.normalize([otherProduct, product]);

        const result = Product.productsByIDsSelector(createState(MOCK_STATE, { [ProductV1.STATE_KEY]: productState }), {
          ids: [DIAGRAM_ID, otherProductID],
        });

        expect(result).to.eql([product, otherProduct]);
      });

      it('select known products', () => {
        const result = Product.productsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['abc', PRODUCT_ID] });

        expect(result).to.eql([MOCK_STATE.byKey.abc, PRODUCT]);
      });

      it('select unknown products', () => {
        const result = Product.productsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['foo', PRODUCT_ID] });

        expect(result).to.eql([PRODUCT]);
      });
    });
  });

  describe('side effects', () => {
    describeEffectV2(ProductV1.replaceProducts, 'replaceProducts()', ({ applyEffect }) => {
      it('replace products locally', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE), [PRODUCT]);

        expect(dispatched).to.eql([ProductV1.crud.replace([PRODUCT])]);
      });

      it('do nothing if atomic actions enabled', async () => {
        const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), [PRODUCT]);

        expect(dispatched).to.be.empty;
      });
    });
  });

  describeEffectV2(ProductV1.patchProduct, 'patchProduct()', ({ applyEffect }) => {
    it('patch product locally', async () => {
      const name = 'foo';
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeProjectID: PROJECT_ID },
      });

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID, { name });

      expect(dispatched).to.eql([ProductV1.crud.patch(PRODUCT_ID, { name })]);
    });

    it('patch product in realtime', async () => {
      const name = 'foo';
      const rootState = createState(MOCK_STATE, {
        ...v2FeatureState,
        [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
      });

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID, { name });

      expect(dispatched).to.eql([{ sync: Realtime.product.crud.patch({ ...ACTION_CONTEXT, key: PRODUCT_ID, value: { name } }) }]);
    });
  });

  describeEffectV2(ProductV1.deleteProduct, 'deleteProduct()', ({ applyEffect }) => {
    it('remove product locally', async () => {
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeProjectID: PROJECT_ID },
      });
      const deleteProduct = stub(client.platform.alexa.project, 'deleteProduct');

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID);

      expect(dispatched).to.eql([ProductV1.crud.remove(PRODUCT_ID)]);
      expect(deleteProduct).to.be.calledWithExactly(PROJECT_ID, PRODUCT_ID);
    });

    it('remove product in realtime', async () => {
      const rootState = createState(MOCK_STATE, {
        ...v2FeatureState,
        [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
      });

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID);

      expect(dispatched).to.eql([{ sync: Realtime.product.crud.remove({ ...ACTION_CONTEXT, key: PRODUCT_ID }) }]);
    });
  });

  describeEffectV2(ProductV1.uploadNewProduct, 'uploadNewProduct()', ({ applyEffect }) => {
    const newProduct = { ...PRODUCT, id: NEW_PRODUCT_ID, name: 'new product data' };

    it('create a new product', async () => {
      const newDBProduct = { name: 'DB formatted new product data' };
      const createdDBProduct = { name: 'DB formatted created product' };
      const createdProduct = { id: Utils.generate.id(), name: 'created product' };
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeProjectID: PROJECT_ID },
      });
      const createProduct = stub(client.platform.alexa.project, 'createProduct').resolves(createdDBProduct as any);
      const productToDB = stub(Realtime.Adapters.productAdapter, 'toDB').returns(newDBProduct as any);
      const productFromDB = stub(Realtime.Adapters.productAdapter, 'fromDB').returns(createdProduct as any);

      const { dispatched } = await applyEffect(rootState, newProduct);

      expect(dispatched).to.eql([ProductV1.crud.add(createdProduct.id, createdProduct as any)]);
      expect(productToDB).to.be.calledWithExactly(newProduct);
      expect(productFromDB).to.be.calledWithExactly(createdDBProduct);
      expect(createProduct).to.be.calledWithExactly(PROJECT_ID, newDBProduct);
    });

    it('do nothing if atomic actions enabled', async () => {
      const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), newProduct);

      expect(dispatched).to.be.empty;
    });
  });

  describeEffectV2(ProductV1.uploadProduct, 'uploadProduct()', ({ applyEffect }) => {
    it('update an existing product', async () => {
      const product = { ...PRODUCT, id: PRODUCT_ID };
      const dbProduct = { name: 'DB formatted new product data' };
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeProjectID: PROJECT_ID },
        [ProductV1.STATE_KEY]: Utils.normalized.normalize([product]),
      });
      const updateProduct = stub(client.platform.alexa.project, 'updateProduct');
      const productToDB = stub(Realtime.Adapters.productAdapter, 'toDB').returns(dbProduct as any);

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID);

      expect(dispatched).to.eql([ProductV1.crud.add(PRODUCT_ID, product)]);
      expect(productToDB).to.be.calledWithExactly(product);
      expect(updateProduct).to.be.calledWithExactly(PROJECT_ID, PRODUCT_ID, { ...dbProduct, productID: PRODUCT_ID });
    });

    it('do nothing if atomic actions enabled', async () => {
      const { dispatched } = await applyEffect(createState(MOCK_STATE, v2FeatureState), PRODUCT_ID);

      expect(dispatched).to.be.empty;
    });
  });
});
