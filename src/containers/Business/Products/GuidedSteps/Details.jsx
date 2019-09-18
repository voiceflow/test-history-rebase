import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Button from '@/componentsV2/Button';
import { NEW_PRODUCT_ID, updateProduct } from '@/ducks/product';

import { Input, NextContainer } from './components';
import { SubSection } from './styled';

function DetailsForm({ product: { testingInstructions, locales, ...restProduct }, locale, updateProduct, onSave }) {
  const onKeywordChange = (e) => {
    updateProduct({
      ...restProduct,
      testingInstructions,
      locales: {
        ...locales,
        [locale]: {
          ...locales[locale],
          keywords: e.target.value.split(', '),
        },
      },
    });
  };

  const onChange = (key) => (e) => {
    updateProduct({
      ...restProduct,
      testingInstructions,
      locales: {
        ...locales,
        [locale]: {
          ...locales[locale],
          [key]: e.target.value,
        },
      },
    });
  };

  const updateTestingInstructions = (e) => {
    updateProduct({
      ...restProduct,
      locales,
      testingInstructions: e.target.value,
    });
  };

  return (
    <AvForm onValidSubmit={onSave}>
      <AvGroup>
        <SubSection>
          <label>Keywords</label>
          <Input
            type="textarea"
            name="keywords"
            placeholder="Enter keywords seperated by commas"
            value={locales[locale].keywords ? locales[locale].keywords.join(', ') : ''}
            onChange={onKeywordChange}
          />
        </SubSection>

        <SubSection>
          <label>In-App Card Description</label>
          <Input
            type="textarea"
            name="cardDescription"
            placeholder="Enter product description for Alexa mobile app"
            value={locales[locale].cardDescription || ''}
            onChange={onChange('cardDescription')}
          />
        </SubSection>

        <SubSection>
          <label>Purchase Prompt</label>
          <Input
            type="textarea"
            name="purchasePrompt"
            placeholder="Enter description while purchasing or cancelling subscription"
            value={locales[locale].purchasePrompt || ''}
            onChange={onChange('purchasePrompt')}
          />
        </SubSection>

        <SubSection>
          <label>Privacy Policy URL</label>
          <Input
            name="privacyPolicyUrl"
            placeholder="Enter a URL to region specific privacy policy"
            value={locales[locale].privacyPolicyUrl || ''}
            onChange={onChange('privacyPolicyUrl')}
          />
        </SubSection>

        <SubSection>
          <label>Testing Information</label>
          <Input
            type="textarea"
            name="instructions"
            placeholder="Enter testing instructions such as test account credentials"
            value={testingInstructions || ''}
            onChange={updateTestingInstructions}
          />
        </SubSection>
      </AvGroup>

      <NextContainer>
        <Button variant="primary">{restProduct.id === NEW_PRODUCT_ID ? 'Create Product' : 'Save'}</Button>
      </NextContainer>
    </AvForm>
  );
}

DetailsForm.proptypes = {
  product: PropTypes.object,
  locale: PropTypes.string,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapDispatchToProps = {
  updateProduct,
};

export default connect(
  null,
  mapDispatchToProps
)(DetailsForm);
