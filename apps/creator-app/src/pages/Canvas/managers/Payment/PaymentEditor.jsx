import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as ProductV2 from '@/ducks/productV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useCurried, useDispatch, useSelector } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import NoProducts from '@/pages/Canvas/components/NoProducts';
import ProductTile from '@/pages/Canvas/components/ProductTile';
import { FadeLeftContainer } from '@/styles/animations';

import { AllProductsLink } from './components';
import SelectedProduct from './SelectedProduct';

function PaymentEditor({ onChange, data }) {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const selectedProduct = useSelector(ProductV2.productByIDSelector, { id: data.productID });
  const products = useSelector(ProductV2.allProductsSelector);
  const updateProduct = useCurried(onChange);
  const goToEditProduct = useDispatch(Router.goToEditProduct, versionID, data.productID);
  const goToProducts = useDispatch(Router.goToProducts, versionID);
  const goToNewProduct = useDispatch(Router.goToNewProduct, versionID);

  if (!products.length) {
    return <NoProducts goToNewProduct={goToNewProduct} />;
  }

  if (selectedProduct) {
    return (
      <Content
        footer={() => (
          <Controls
            menu={<OverflowMenu options={[{ onClick: updateProduct({ productID: null }), label: 'Unlink Product' }]} placement="top-end" />}
          />
        )}
      >
        <FadeLeftContainer>
          <SelectedProduct product={selectedProduct} onClick={goToEditProduct} />
        </FadeLeftContainer>
      </Content>
    );
  }

  return (
    <Content
      footer={() => (
        <Controls options={[{ label: 'Create Product', onClick: stopPropagation(goToNewProduct) }]}>
          <AllProductsLink onClick={goToProducts}>See all Products</AllProductsLink>
        </Controls>
      )}
    >
      {products.map((product, index) => (
        <ProductTile key={index} product={product} onClick={updateProduct({ productID: product.id })} />
      ))}
    </Content>
  );
}

export default PaymentEditor;
