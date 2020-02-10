/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@/components/Button';
import Flex from '@/components/Flex';
import Image from '@/components/LegacyUpload/Image';
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
      <Flex>
        <IconContainer>
          <label>Small Icon</label>
          <Image
            className="icon-image small-icon"
            path="/image/small_icon"
            image={product.smallIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'smallIconUri')}
          />
        </IconContainer>

        <IconContainer noBorder>
          <label>Large Icon</label>
          <Image
            className="icon-image large-icon"
            path="/image/large_icon"
            image={product.largeIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'largeIconUri')}
          />
        </IconContainer>
      </Flex>

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
