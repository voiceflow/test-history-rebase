/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control, no-shadow */
import { Box, Button } from '@voiceflow/ui';
import PropTypes from 'prop-types';
import React from 'react';

import { UploadIconVariant, UploadJustIcon as Image } from '@/components/Upload/ImageUpload/IconUpload';
import { productByIDSelector, updateProduct } from '@/ducks/product';
import { connect } from '@/hocs';

import { IconContainer, NextButtonContainer } from './components';

function IconForm({ product, updateProduct, changeStep }) {
  const uploadImage = (url, key) => {
    updateProduct({
      ...product,
      [key]: url,
    });
  };

  return (
    <>
      <Box display="flex">
        <IconContainer>
          <label>Small Icon</label>
          <Image
            size={UploadIconVariant.MEDIUM}
            endpoint="/image/small_icon"
            image={product.smallIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'smallIconUri')}
          />
        </IconContainer>

        <IconContainer noBorder>
          <label>Large Icon</label>
          <Image
            size={UploadIconVariant.LARGE}
            endpoint="/image/large_icon"
            image={product.largeIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'largeIconUri')}
          />
        </IconContainer>
      </Box>

      <NextButtonContainer>
        <Button variant="secondary" onClick={changeStep}>
          Next
        </Button>
      </NextButtonContainer>
    </>
  );
}

IconForm.proptypes = {
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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(IconForm);
