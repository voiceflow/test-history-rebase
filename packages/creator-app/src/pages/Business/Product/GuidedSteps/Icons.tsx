/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import { Box, Button, ButtonVariant, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import { ProductContext } from '../../contexts';
import { IconContainer, NextButtonContainer } from './components';

export interface IconFormProps {
  advanceStep: VoidFunction;
}

const IconForm: React.FC<IconFormProps> = ({ advanceStep }) => {
  const { product, setProductPropertyNullable } = React.useContext(ProductContext)!;

  return (
    <>
      <Box display="flex">
        <IconContainer>
          <label>Small Icon</label>
          <Upload.IconUpload
            size={UploadIconVariant.MEDIUM}
            endpoint="/image/small_icon"
            image={product.smallIconUri}
            update={setProductPropertyNullable('smallIconUri')}
          />
        </IconContainer>

        <IconContainer noBorder>
          <label>Large Icon</label>
          <Upload.IconUpload
            size={UploadIconVariant.LARGE}
            endpoint="/image/large_icon"
            image={product.largeIconUri}
            update={setProductPropertyNullable('largeIconUri')}
          />
        </IconContainer>
      </Box>

      <NextButtonContainer>
        <Button variant={ButtonVariant.SECONDARY} onClick={advanceStep}>
          Next
        </Button>
      </NextButtonContainer>
    </>
  );
};

export default IconForm;
