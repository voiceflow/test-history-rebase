/* eslint-disable no-shadow */
import React from 'react';

import OverflowMenu from '@/componentsV2/OverflowMenu';
import { Content, Controls } from '@/containers/CanvasV2/components/Editor';
import NoProducts from '@/containers/CanvasV2/components/NoProducts';
import ProductTile from '@/containers/CanvasV2/components/ProductTile';
import { allProductsSelector, hasProductsSelector, productByIDSelector } from '@/ducks/product';
import { goToEditProduct, goToNewProduct, goToProducts } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useCurried } from '@/hooks';
import { FadeLeftContainer } from '@/styles/animations';
import { stopPropagation } from '@/utils/dom';

import SelectedProduct from './SelectedProduct';
import { AllProductsLink } from './components';

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
  skillID: activeSkillIDSelector,
  selectedProduct: productByIDSelector,
  hasProducts: hasProductsSelector,
  products: allProductsSelector,
};

const mapDispatchToProps = {
  goToEditProduct,
  goToProducts,
  goToNewProduct,
};

const mergeProps = ({ selectedProduct: getProductByID, skillID }, { goToEditProduct, goToProducts, goToNewProduct }, { data }) => ({
  selectedProduct: data.productID && getProductByID(data.productID),
  goToEditProduct: () => data.productID && goToEditProduct(skillID, data.productID),
  goToProducts: () => goToProducts(skillID),
  goToNewProduct: () => goToNewProduct(skillID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(PaymentEditor);
