/* eslint-disable no-shadow */
import React from 'react';

import Divider from '@/components/Divider';
import Section, { SectionToggleVariant } from '@/componentsV2/Section';
import TextArea from '@/componentsV2/TextArea';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import EditorSection from '@/containers/CanvasV2/components/EditorSection';
import ProductTile from '@/containers/CanvasV2/components/ProductTile';
import { NamespaceProvider } from '@/contexts';
import { productByIDSelector, updateProduct, uploadProduct } from '@/ducks/product';
import { connect } from '@/hocs';

import { UpsellRequirementItem, UpsellSection, UpsellSectionTitle } from './components';
import * as Requirements from './constants';

function SelectedProduct({ product, onClick, updateProduct }) {
  const [value, setValue] = React.useState(product.purchasePrompt || '');

  const updateUpsellMessage = () => updateProduct({ ...product, purchasePrompt: value });

  return (
    <NamespaceProvider value={['product', product.id]}>
      <ProductTile edit product={product} imageIconSize={18} onClick={onClick} title="Edit Product" />

      <EditorSection namespace="upsellMessage" header="Upsell Message" headerToggle isDividerNested collapseVariant={SectionToggleVariant.ARROW}>
        <FormControl>
          <TextArea
            name="purchasePrompt"
            value={value}
            onBlur={updateUpsellMessage}
            minRows={4}
            onChange={({ target }) => setValue(target.value)}
            placeholder="Enter Upsell message"
          />
        </FormControl>
      </EditorSection>

      <Section header="Requirement of Upsell Message" headerToggle isDividerNested collapseVariant={SectionToggleVariant.ARROW}>
        <div>{Requirements.UPSELL_REQUIREMENTS}</div>
        <Divider />
        <div>
          <UpsellSectionTitle color="#279745">DO</UpsellSectionTitle>
          {Requirements.DOS.map((item, index) => (
            <UpsellRequirementItem key={index}>{item}</UpsellRequirementItem>
          ))}
        </div>
        <Divider />
        <div>
          <UpsellSectionTitle color="#E91E63">DON'T</UpsellSectionTitle>
          {Requirements.DONTS.map((item, index) => (
            <UpsellRequirementItem key={index}>{item}</UpsellRequirementItem>
          ))}
        </div>
        <Divider />

        <UpsellSection>{Requirements.WARNING}</UpsellSection>
      </Section>
    </NamespaceProvider>
  );
}

const mapStateToProps = {
  product: productByIDSelector,
};

const mapDispatchToProps = {
  updateProduct,
  uploadProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct, uploadProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (values) => {
    updateProduct(productID, values);
    uploadProduct(productID);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SelectedProduct);
