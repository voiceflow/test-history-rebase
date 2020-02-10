/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import { AvForm, AvGroup } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
import { NEW_PRODUCT_ID } from '@/constants';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { connect } from '@/hocs';

import { NextButtonContainer, SubSection } from './components';

function DetailsForm({ product, updateProduct, onSave }) {
  const onKeywordChange = (e) => {
    updateProduct({
      ...product,
      keywords: e.target.value.split(', '),
    });
  };

  const onChange = (key) => (e) => {
    updateProduct({
      ...product,
      [key]: e.target.value,
    });
  };

  return (
    <AvForm onValidSubmit={onSave}>
      <AvGroup>
        <SubSection>
          <label>Keywords</label>
          <TextArea
            minRows={3}
            name="keywords"
            placeholder="Enter keywords seperated by commas"
            value={product.keywords ? product.keywords.join(', ') : ''}
            onChange={onKeywordChange}
          />
        </SubSection>

        <SubSection>
          <label>In-App Card Description</label>
          <TextArea
            minRows={3}
            name="cardDescription"
            placeholder="Enter product description for Alexa mobile app"
            value={product.cardDescription || ''}
            onChange={onChange('cardDescription')}
          />
        </SubSection>

        <SubSection>
          <label>Privacy Policy URL</label>
          <Input
            name="privacyPolicyUrl"
            placeholder="Enter a URL to region specific privacy policy"
            value={product.privacyPolicyUrl || ''}
            onChange={onChange('privacyPolicyUrl')}
          />
        </SubSection>

        <SubSection>
          <label>Testing Information</label>
          <TextArea
            minRows={3}
            name="instructions"
            placeholder="Enter testing instructions such as test account credentials"
            value={product.testingInstructions || ''}
            onChange={onChange('testingInstructions')}
          />
        </SubSection>
      </AvGroup>

      <NextButtonContainer>
        <Button disabled={!(product.name && product.summary)} variant="primary">
          {product.id === NEW_PRODUCT_ID ? 'Create Product' : 'Save'}
        </Button>
      </NextButtonContainer>
    </AvForm>
  );
}

DetailsForm.proptypes = {
  product: PropTypes.object,
  changeStep: PropTypes.func,
  updateProduct: PropTypes.func,
};

const mapStateToProps = {
  product: productByIDSelector,
};

const mapDispatchToProps = {
  updateProduct,
};

const mergeProps = ({ product: productByIDSelector }, { updateProduct }, { productID }) => ({
  product: productByIDSelector(productID),
  updateProduct: (product) => updateProduct(productID, product),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailsForm);
