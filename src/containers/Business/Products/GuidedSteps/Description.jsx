import { AvFeedback, AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Button from '@/componentsV2/Button';
import { updateProduct } from '@/ducks/product';

import { NextContainer } from './components';

function DescriptionForm({ product, locale, changeStep, updateProduct }) {
  const onNameChange = (e) => {
    updateProduct({
      ...product,
      name: e.target.value,
      locales: {
        ...product.locales,
        [locale]: {
          ...product.locales[locale],
          name: e.target.value,
        },
      },
    });
  };

  const onDiscriptionChange = (key) => (e) => {
    updateProduct({
      ...product,
      locales: {
        ...product.locales,
        [locale]: {
          ...product.locales[locale],
          [key]: e.target.value,
        },
      },
    });
  };

  return (
    <AvForm onValidSubmit={changeStep}>
      <AvGroup>
        <label>Product Name</label>
        <AvInput className="form-bg" name="name" placeholder="Enter a name for your product" value={product.name} onChange={onNameChange} required />
        <AvFeedback>Name is required</AvFeedback>
      </AvGroup>

      <AvGroup>
        <label className="label-margin-top">Short Description</label>
        <AvInput
          className="form-bg"
          name="summary"
          placeholder="Enter a short description for your product"
          value={product.locales[locale].summary || ''}
          onChange={onDiscriptionChange('summary')}
          required
        />
        <AvFeedback>Description is required</AvFeedback>
      </AvGroup>

      <AvGroup>
        <label className="label-margin-top">Detailed Description</label>
        <AvInput
          type="textarea"
          resize="true"
          className="form-bg"
          name="description"
          placeholder="Describe the products functionality and any prerequisites"
          value={product.locales[locale].description || ''}
          onChange={onDiscriptionChange('description')}
        />
      </AvGroup>

      <NextContainer>
        <Button disabled={!(product.name && product.locales[locale].summary)} variant="secondary">
          Next
        </Button>
      </NextContainer>
    </AvForm>
  );
}

DescriptionForm.proptypes = {
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
)(DescriptionForm);
