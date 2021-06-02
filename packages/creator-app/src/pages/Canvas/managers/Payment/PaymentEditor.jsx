/* eslint-disable no-shadow */
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { allProductsSelector, hasProductsSelector, productByIDSelector } from '@/ducks/product';
import { goToEditProduct, goToNewProduct, goToProducts } from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useCurried } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import NoProducts from '@/pages/Canvas/components/NoProducts';
import ProductTile from '@/pages/Canvas/components/ProductTile';
import { FadeLeftContainer } from '@/styles/animations';
import { stopPropagation } from '@/utils/dom';

import { AllProductsLink } from './components';
import SelectedProduct from './SelectedProduct';

function PaymentEditor({ selectedProduct, goToEditProduct, goToProducts, goToNewProduct, onChange, hasProducts, products }) {
  const updateProduct = useCurried(onChange);

  if (!hasProducts) {
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
          <SelectedProduct productID={selectedProduct.id} onClick={goToEditProduct} />
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

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
  selectedProduct: productByIDSelector,
  hasProducts: hasProductsSelector,
  products: allProductsSelector,
};

const mapDispatchToProps = {
  goToEditProduct,
  goToProducts,
  goToNewProduct,
};

const mergeProps = ({ selectedProduct: getProductByID, versionID }, { goToEditProduct, goToProducts, goToNewProduct }, { data }) => ({
  selectedProduct: data.productID && getProductByID(data.productID),
  goToEditProduct: () => data.productID && goToEditProduct(versionID, data.productID),
  goToProducts: () => goToProducts(versionID),
  goToNewProduct: () => goToNewProduct(versionID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(PaymentEditor);
