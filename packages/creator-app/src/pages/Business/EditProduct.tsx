import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Product from '@/ducks/product';
import * as ProductV2 from '@/ducks/productV2';
import { useDispatch, useSelector } from '@/hooks';

import { ProductProvider } from './contexts';
import ProductForm from './Product';

export interface EditProductProps {
  productID: string;
}

const EditProduct: React.FC<RouteComponentProps<{ productID: string }>> = ({ match }) => {
  const { productID } = match.params;

  const product = useSelector(ProductV2.productByIDSelector, { id: productID });

  const patchProduct = useDispatch(Product.patchProduct, productID);

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
