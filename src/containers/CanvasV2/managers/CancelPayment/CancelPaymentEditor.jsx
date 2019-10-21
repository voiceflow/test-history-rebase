import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import ProductSelect from '@/components/ProductSelect';
import SvgIcon from '@/components/SvgIcon';
import { FlexCenter } from '@/componentsV2/Flex';
import { Section } from '@/containers/CanvasV2/components/BlockEditor';
import { hasProductsSelector, productByIDSelector } from '@/ducks/product';
import { goToEditProduct, goToProducts } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

function CancelPaymentEditor({ onChange, goToProducts, goToEditProduct, selectedProduct, hasProducts }) {
  const updateProduct = (productID) => onChange({ productID });
  const unlinkProduct = () => updateProduct(null);

  if (!hasProducts) {
    return (
      <Section>
        <FlexCenter column>
          <SvgIcon icon="safe" size="auto" />
          <br />
          <div className="text-muted">You currently have no In Skill Products</div>
          <button className="btn btn-secondary mt-3" onClick={goToProducts}>
            Add Products
          </button>
        </FlexCenter>
      </Section>
    );
  }

  if (selectedProduct) {
    return (
      <Section>
        <label className="space-between mb-3">
          <span>{selectedProduct.name}</span>
        </label>
        <Button className="btn-primary btn-block btn-lg" onClick={goToEditProduct}>
          Edit Product <i className="fas fa-sign-in" />
        </Button>
        <button className="btn-lg mt-2 btn-block btn-clear" onClick={unlinkProduct}>
          Unlink Product
        </button>
        <Alert color="warning" className="mt-3">
          {selectedProduct.type === 'SUBSCRIPTION'
            ? 'The user will have their subscription cancelled'
            : 'The user will be refunded their product purchase'}
        </Alert>
      </Section>
    );
  }

  return (
    <Section>
      <label>Select Existing Product</label>
      <ProductSelect onChange={updateProduct} />
    </Section>
  );
}

const mapStateToProps = {
  skillID: activeSkillIDSelector,
  selectedProduct: productByIDSelector,
  hasProducts: hasProductsSelector,
};

const mapDispatchToProps = {
  goToEditProduct,
  goToProducts,
};

const mergeProps = ({ selectedProduct: getProductByID, skillID }, { goToEditProduct, goToProducts }, { data }) => ({
  selectedProduct: data.productID && getProductByID(data.productID),
  goToEditProduct: () => data.productID && goToEditProduct(skillID, data.productID),
  goToProducts: () => goToProducts(skillID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(CancelPaymentEditor);
