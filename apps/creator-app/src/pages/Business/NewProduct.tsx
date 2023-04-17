import { AlexaConstants } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useCachedValue } from '@voiceflow/ui';
import React from 'react';

import * as Product from '@/ducks/product';
import { createNewProduct } from '@/ducks/product/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector, useTeardown } from '@/hooks';

import { ProductProvider } from './contexts';
import ProductForm from './Product';

const NewProduct: React.FC = () => {
  const locales = useSelector(VersionV2.active.localesSelector) as AlexaConstants.Locale[];
  const [product, setProduct] = React.useState(() => createNewProduct(locales));
  const productRef = useCachedValue(product);

  const createProduct = useDispatch(Product.createProduct);
  const patchProduct = React.useCallback((data: Partial<Realtime.Product>) => setProduct({ ...productRef.current, ...data }), []);

  useTeardown(() => {
    const productState = productRef.current;

    if (!productState || !productState.name || !productState.summary) return;

    createProduct(productState);
  });

  return (
    <ProductProvider product={product} patchProduct={patchProduct}>
      <ProductForm />
    </ProductProvider>
  );
};

export default NewProduct;
