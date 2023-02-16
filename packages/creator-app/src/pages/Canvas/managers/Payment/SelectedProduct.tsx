import * as Realtime from '@voiceflow/realtime-sdk';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { NamespaceProvider } from '@/contexts/NamespaceContext';
import * as Product from '@/ducks/product';
import { useDispatch } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import ProductTile from '@/pages/Canvas/components/ProductTile';

import { UpsellRequirementItem, UpsellSection, UpsellSectionTitle } from './components';
import * as Requirements from './constants';

export interface SelectedProductProps {
  product: Realtime.Product;
  onClick: VoidFunction;
}

const SelectedProduct: React.FC<SelectedProductProps> = ({ product, onClick }) => {
  const [value, setValue] = React.useState(product.purchasePrompt || '');
  const patchProduct = useDispatch(Product.patchProduct, product.id);

  const updateUpsellMessage = () => patchProduct({ purchasePrompt: value });

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
};

export default SelectedProduct;
