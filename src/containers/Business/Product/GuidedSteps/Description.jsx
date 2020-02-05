/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import moize from 'moize';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@/componentsV2/Button';
import TextArea from '@/componentsV2/TextArea';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { connect } from '@/hocs';

import { NextButtonContainer } from './components';

function DescriptionForm({ product, changeStep, updateProduct }) {
  const onChange = React.useMemo(
    () =>
      moize((key) => (e) => {
        updateProduct({
          ...product,
          [key]: e.target.value,
        });
      }),
    [updateProduct]
  );

  return (
    <AvForm onSubmit={changeStep}>
      <AvGroup>
        <label>Product Name</label>
        <AvInput maxLength="50" name="name" placeholder="Enter a name for your product" value={product.name} onChange={onChange('name')} required />
        <AvFeedback>Name is required</AvFeedback>
      </AvGroup>

      <AvGroup>
        <label className="label-margin-top">Short Description</label>
        <AvInput
          name="summary"
          placeholder="Enter a short description for your product"
          value={product.summary || ''}
          onChange={onChange('summary')}
          required
        />
        <AvFeedback>Description is required</AvFeedback>
      </AvGroup>

      <AvGroup>
        <label className="label-margin-top">Detailed Description</label>
        <TextArea
          minRows={3}
          name="description"
          placeholder="Describe the products functionality and any prerequisites"
          value={product.description || ''}
          onChange={onChange('description')}
        />
      </AvGroup>

      <NextButtonContainer>
        <Button variant="secondary">Next</Button>
      </NextButtonContainer>
    </AvForm>
  );
}

DescriptionForm.proptypes = {
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
)(DescriptionForm);
