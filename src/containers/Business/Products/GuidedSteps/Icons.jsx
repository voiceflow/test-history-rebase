import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Image from '@/components/Uploads/Image';
import Button from '@/componentsV2/Button';
import { updateProduct } from '@/ducks/product';

import { FlexContainer, IconContainer, NextContainer } from './components';

function IconForm({ product: { locales, ...restProduct }, locale, updateProduct, changeStep }) {
  const uploadImage = (url, key) => {
    updateProduct({
      ...restProduct,
      locales: {
        ...locales,
        [locale]: {
          ...locales[locale],
          [key]: url,
        },
      },
    });
  };

  return (
    <>
      <FlexContainer>
        <IconContainer>
          <label>Small Icon</label>
          <Image
            className="icon-image small-icon"
            path="/image/small_icon"
            image={locales[locale].smallIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'smallIconUri')}
          />
        </IconContainer>
        <IconContainer noBorder>
          <label>Large Icon</label>
          <Image
            className="icon-image large-icon"
            path="/image/large_icon"
            image={locales[locale].largeIconUri}
            update={(imgUrl) => uploadImage(imgUrl, 'largeIconUri')}
          />
        </IconContainer>
      </FlexContainer>

      <NextContainer>
        <Button variant="secondary" onClick={changeStep}>
          Next
        </Button>
      </NextContainer>
    </>
  );
}

IconForm.proptypes = {
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
)(IconForm);
