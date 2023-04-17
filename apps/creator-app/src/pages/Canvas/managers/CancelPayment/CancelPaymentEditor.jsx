import React from 'react';

import Section from '@/components/Section';
import * as ProductV2 from '@/ducks/productV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useCurried, useDispatch, useSelector } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import NoProducts from '@/pages/Canvas/components/NoProducts';
import ProductTile from '@/pages/Canvas/components/ProductTile';

import { CancelPaymentFooter } from './components';

function CancelPaymentEditor({ onChange, data }) {
  const versionID = useSelector(Session.activeVersionIDSelector);
  const selectedProduct = useSelector(ProductV2.productByIDSelector, { id: data.productID });
  const products = useSelector(ProductV2.allProductsSelector);
  const updateProduct = useCurried(onChange);
  const goToEditProduct = useDispatch(Router.goToEditProduct, versionID, data.productID);
  const goToNewProduct = useDispatch(Router.goToNewProduct, versionID);

  if (!products.length) {
    return <NoProducts goToNewProduct={goToNewProduct} />;
  }

  if (selectedProduct) {
    return (
      <Content footer={() => <CancelPaymentFooter updateProduct={updateProduct} withMenu blockType={data.type} />}>
        <Section variant="secondary" header="Product to Cancel" customContentStyling={{ padding: 0 }}>
          <ProductTile product={selectedProduct} imageIconSize={18} isNested onClick={goToEditProduct} title="Edit Product" />
        </Section>
      </Content>
    );
  }

  return (
    <Content footer={() => <CancelPaymentFooter blockType={data.type} />}>
      <Section variant="secondary" header="Choose Product to Cancel" customContentStyling={{ padding: 0 }}>
        {products.map((product) => (
          <ProductTile key={product.id} product={product} isNested onClick={updateProduct({ productID: product.id })} />
        ))}
      </Section>
    </Content>
  );
}

export default CancelPaymentEditor;
