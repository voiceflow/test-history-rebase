import React from 'react';

import Section from '@/components/Section';
import * as Product from '@/ducks/product';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useCurried } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import NoProducts from '@/pages/Canvas/components/NoProducts';
import ProductTile from '@/pages/Canvas/components/ProductTile';

import { CancelPaymentFooter } from './components';

function CancelPaymentEditor({ products, onChange, goToNewProduct, goToEditProduct, selectedProduct, hasProducts, data }) {
  const updateProduct = useCurried(onChange);

  if (!hasProducts) {
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

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
  selectedProduct: Product.productByIDSelector,
  hasProducts: Product.hasProductsSelector,
  products: Product.allProductsSelector,
};

const mapDispatchToProps = {
  goToEditProduct: Router.goToEditProduct,
  goToProducts: Router.goToProducts,
  goToNewProduct: Router.goToNewProduct,
};

const mergeProps = ({ selectedProduct: getProductByID, versionID }, { goToEditProduct, goToProducts, goToNewProduct }, { data }) => ({
  selectedProduct: data.productID && getProductByID(data.productID),
  goToEditProduct: () => data.productID && goToEditProduct(versionID, data.productID),
  goToProducts: () => goToProducts(versionID),
  goToNewProduct: () => goToNewProduct(versionID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CancelPaymentEditor);
