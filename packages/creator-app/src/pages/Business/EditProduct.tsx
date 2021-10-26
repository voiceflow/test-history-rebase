import { useCachedValue } from '@voiceflow/ui';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import * as Product from '@/ducks/product';
import * as ProductV2 from '@/ducks/productV2';
import { useDispatch, useFeature, useSelector, useTeardown } from '@/hooks';

import { ProductProvider } from './contexts';
import ProductForm from './Product';

export interface EditProductProps {
  productID: string;
}

const EditProduct: React.FC<RouteComponentProps<{ productID: string }>> = ({ match }) => {
  const { productID } = match.params;

  const atomicActions = useFeature(FeatureFlag.ATOMIC_ACTIONS);
  const product = useSelector((state) => ProductV2.productByIDSelector(state, { id: productID }));
  const productRef = useCachedValue(product);

  const uploadProduct = useDispatch(Product.uploadProduct, productID);
  const patchProduct = useDispatch(Product.patchProduct, productID);

  useTeardown(() => {
    if (atomicActions.isEnabled) return;

    const productState = productRef.current;
    if (!productState) return;

    if (productState.name && productState.summary) {
      uploadProduct();
    }
  });

  if (!product) {
    return <Redirect to={Path.PRODUCT_LIST} />;
  }

  return (
    <ProductProvider product={product} patchProduct={patchProduct}>
      <ProductForm />
    </ProductProvider>
  );
};

export default EditProduct;
