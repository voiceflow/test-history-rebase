import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import ProductSelect from '@/components/ProductSelect';
import SvgIcon from '@/components/SvgIcon';
import { FlexCenter } from '@/componentsV2/Flex';
import { Section } from '@/containers/CanvasV2/components/BlockEditor';
import { hasProductsSelector, productByIDSelector } from '@/ducks/product';
import { goToEditProduct, goToNewProduct, goToProducts } from '@/ducks/router';
import { activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import { LabelTitle, SeeAll, Separator } from './styled';

function PaymentEditor({ data, selectedProduct, goToEditProduct, goToProducts, goToNewProduct, onChange, hasProducts }) {
  const updateProduct = (productID) => onChange({ productID });
  const unlinkProduct = () => updateProduct(null);

  if (!hasProducts) {
    return (
      <Section className="text-center">
        <FlexCenter column>
          <SvgIcon icon="safe" size="auto" />
          <br />
          <label className="dark">No Products Exist</label>
          <div className="text-muted">Create a product to add it to this block</div>
          <button className="btn btn-secondary mt-4" onClick={stopPropagation(goToNewProduct)}>
            Add Product
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
        <Button isPrimary isBlock isLarge onClick={goToEditProduct}>
          Edit Product <i className="fas fa-sign-in" />
        </Button>
        <Button isClear isLarge isBlock className="mt-2" onClick={unlinkProduct}>
          Unlink Product
        </Button>
        {selectedProduct.type === 'SUBSCRIPTION' ? (
          <>
            <Divider>Subscription Settings</Divider>
            <Alert>Alexa requires an unsubscribe option, place a cancel payment block in an easily accessible part of your flow</Alert>
          </>
        ) : (
          <>
            <Divider>Refund Settings</Divider>
            <Alert>Alexa requires users be able to refund a purchase, place a cancel payment block in an easily accessible part of your flow</Alert>
          </>
        )}
        {/* <MenuItem item={cancel} data={product.id} /> */}
      </Section>
    );
  }

  return (
    <Section>
      <LabelTitle>
        <label>Select Existing Product</label>
        <SeeAll onClick={goToProducts}>See all</SeeAll>
      </LabelTitle>
      <ProductSelect value={data.productID} onChange={updateProduct} />
      <div>
        <Separator>
          <div>OR</div>
        </Separator>
      </div>
      <button className="btn-clear btn-block btn-lg" onClick={goToNewProduct}>
        Create new product
      </button>
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
