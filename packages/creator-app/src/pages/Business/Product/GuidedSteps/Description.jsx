import { Box, Button, Label } from '@voiceflow/ui';
import moize from 'moize';
import PropTypes from 'prop-types';
import React from 'react';

import TextInput from '@/components/Form/TextInput';
import TextArea from '@/components/TextArea';
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

  React.useEffect(() => onChange.clear, [onChange]);

  return (
    <Box>
      <Box mb={24}>
        <Label>Product Name</Label>
        <TextInput
          maxLength="50"
          name="name"
          placeholder="Enter a name for your product"
          value={product.name}
          onChange={onChange('name')}
          required
          error="Name is required"
        />
      </Box>

      <Box mb={24}>
        <Label className="label-margin-top">Short Description</Label>
        <TextInput
          name="summary"
          placeholder="Enter a short description for your product"
          value={product.summary || ''}
          onChange={onChange('summary')}
          required
          error="Description is required"
        />
      </Box>

      <Box mb={24}>
        <Label className="label-margin-top">Detailed Description</Label>
        <TextArea
          minRows={3}
          name="description"
          placeholder="Describe the products functionality and any prerequisites"
          value={product.description || ''}
          onChange={onChange('description')}
        />
      </Box>

      <NextButtonContainer>
        <Button variant="secondary" onClick={changeStep}>
          Next
        </Button>
      </NextButtonContainer>
    </Box>
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DescriptionForm);
