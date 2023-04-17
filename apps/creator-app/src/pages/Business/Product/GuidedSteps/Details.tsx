/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import { Box, Button, Input } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';
import { NEW_PRODUCT_ID } from '@/constants';
import { useInputValue } from '@/hooks';

import { ProductContext } from '../../contexts';
import { NextButtonContainer, SubSection } from './components';

export interface DetailsFormProps {
  onSave: VoidFunction;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onSave }) => {
  const { product, patchProduct, setProductProperty } = React.useContext(ProductContext)!;

  const updateKeywords = React.useCallback((keywords: string) => patchProduct({ keywords: keywords.split(', ') }), [patchProduct]);
  const [keywordsString, setKeywordsString, saveKeywords] = useInputValue(product.keywords.join(', ') ?? '', updateKeywords);
  const [cardDescription, setCardDescription, saveCardDescription] = useInputValue(
    product.cardDescription ?? '',
    setProductProperty('cardDescription')
  );
  const [privacyPolicyUrl, setPrivacyPolicyUrl, savePrivacyPolicyUrl] = useInputValue(
    product.privacyPolicyUrl ?? '',
    setProductProperty('privacyPolicyUrl')
  );
  const [testingInstructions, setTestingInstructions, saveTestingInstructions] = useInputValue(
    product.testingInstructions ?? '',
    setProductProperty('testingInstructions')
  );

  return (
    <Box>
      <Box mb={24}>
        <SubSection>
          <label>Keywords</label>
          <TextArea
            minRows={3}
            name="keywords"
            placeholder="Enter keywords seperated by commas"
            value={keywordsString}
            onChange={setKeywordsString}
            onBlur={saveKeywords}
          />
        </SubSection>

        <SubSection>
          <label>In-App Card Description</label>
          <TextArea
            minRows={3}
            name="cardDescription"
            placeholder="Enter product description for Alexa mobile app"
            value={cardDescription}
            onChange={setCardDescription}
            onBlur={saveCardDescription}
          />
        </SubSection>

        <SubSection>
          <label>Privacy Policy URL</label>
          <Input
            name="privacyPolicyUrl"
            value={privacyPolicyUrl}
            onBlur={savePrivacyPolicyUrl}
            onChange={setPrivacyPolicyUrl}
            placeholder="Enter a URL to region specific privacy policy"
          />
        </SubSection>

        <SubSection>
          <label>Testing Information</label>
          <TextArea
            minRows={3}
            name="instructions"
            placeholder="Enter testing instructions such as test account credentials"
            value={testingInstructions}
            onChange={setTestingInstructions}
            onBlur={saveTestingInstructions}
          />
        </SubSection>
      </Box>

      <NextButtonContainer>
        <Button disabled={!(product.name && product.summary)} onClick={onSave}>
          {product.id === NEW_PRODUCT_ID ? 'Create Product' : 'Save'}
        </Button>
      </NextButtonContainer>
    </Box>
  );
};

export default DetailsForm;
