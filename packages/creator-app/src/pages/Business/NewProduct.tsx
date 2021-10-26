import { Constants } from '@voiceflow/alexa-types';
import { useCachedValue } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Product from '@/ducks/product';
import { createNewProduct } from '@/ducks/product/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useFeature, useSelector, useTeardown } from '@/hooks';
import * as Models from '@/models';

import { ProductProvider } from './contexts';
import ProductForm from './Product';

const NewProduct: React.FC = () => {
  const locales = useSelector(VersionV2.active.localesSelector) as Constants.Locale[];
  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const [product, setProduct] = React.useState(() => createNewProduct(locales));
  const productRef = useCachedValue(product);

  const uploadNewProduct = useDispatch(Product.uploadNewProduct);
  const addProduct = useDispatch(Product.addProduct);
  const patchProduct = React.useCallback((data: Partial<Models.Product>) => setProduct({ ...productRef.current, ...data }), []);

  useTeardown(() => {
    const productState = productRef.current;
    if (!productState || !productState.name || !productState.summary) return;

    if (atomicActions.isEnabled) {
      addProduct(productState);
    } else {
      uploadNewProduct(productState);
    }
  });

  return (
    <ProductProvider product={product} patchProduct={patchProduct}>
      <ProductForm />
    </ProductProvider>
  );
};

export default NewProduct;
