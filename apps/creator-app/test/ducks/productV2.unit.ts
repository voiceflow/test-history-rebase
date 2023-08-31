import { AlexaConstants } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Product from '@/ducks/productV2';
import { createNewProduct } from '@/ducks/productV2/utils';
import * as Session from '@/ducks/session';

import suite from './_suite';

const WORKSPACE_ID = 'workspaceID';
const PROJECT_ID = 'projectID';
const VERSION_ID = 'versionID';
const PRODUCT_ID = 'productID';
const ACTION_CONTEXT = { workspaceID: WORKSPACE_ID, projectID: PROJECT_ID, versionID: VERSION_ID };

const PRODUCT: Realtime.Product = {
  ...createNewProduct([AlexaConstants.Locale.EN_AU, AlexaConstants.Locale.DE_DE]),
  id: PRODUCT_ID,
  name: 'product',
};

const MOCK_STATE: Product.ProductState = {
  byKey: {
    [PRODUCT_ID]: PRODUCT,
    abc: {
      ...createNewProduct([AlexaConstants.Locale.EN_AU, AlexaConstants.Locale.DE_DE]),
      id: 'abc',
      name: 'alphabet product',
    },
  },
  allKeys: [PRODUCT_ID, 'abc'],
};

suite(Product, MOCK_STATE)('Ducks - Product V2', ({ describeEffectV2, createState }) => {
  describe('selectors', () => {
    describe('allProductsSelector()', () => {
      it('select all products', () => {
        const result = Product.allProductsSelector(createState(MOCK_STATE));

        expect(result).toEqual([PRODUCT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('productMapSelector()', () => {
      it('select product map', () => {
        const result = Product.productMapSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.byKey);
      });
    });

    describe('productByIDSelector()', () => {
      it('select known product', () => {
        const result = Product.productByIDSelector(createState(MOCK_STATE), { id: PRODUCT_ID });

        expect(result).toBe(PRODUCT);
      });

      it('select unknown product', () => {
        const result = Product.productByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('productsByIDsSelector()', () => {
      it('select known products', () => {
        const result = Product.productsByIDsSelector(createState(MOCK_STATE), { ids: ['abc', PRODUCT_ID] });

        expect(result).toEqual([MOCK_STATE.byKey.abc, PRODUCT]);
      });

      it('select unknown products', () => {
        const result = Product.productsByIDsSelector(createState(MOCK_STATE), { ids: ['foo', PRODUCT_ID] });

        expect(result).toEqual([PRODUCT]);
      });
    });
  });

  describeEffectV2(Product.patchProduct, 'patchProduct()', ({ applyEffect }) => {
    it('patch product in realtime', async () => {
      const name = 'foo';
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
      });

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID, { name });

      expect(dispatched).toEqual([{ sync: Realtime.product.crud.patch({ ...ACTION_CONTEXT, key: PRODUCT_ID, value: { name } }) }]);
    });
  });

  describeEffectV2(Product.deleteProduct, 'deleteProduct()', ({ applyEffect }) => {
    it('remove product in realtime', async () => {
      const rootState = createState(MOCK_STATE, {
        [Session.STATE_KEY]: { activeWorkspaceID: WORKSPACE_ID, activeProjectID: PROJECT_ID, activeVersionID: VERSION_ID },
      });

      const { dispatched } = await applyEffect(rootState, PRODUCT_ID);

      expect(dispatched).toEqual([{ sync: Realtime.product.crud.remove({ ...ACTION_CONTEXT, key: PRODUCT_ID }) }]);
    });
  });
});
