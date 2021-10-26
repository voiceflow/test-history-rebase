/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */
import { Box, Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadIconVariant, UploadJustIcon as Image } from '@/components/Upload/ImageUpload/IconUpload';

import { ProductContext } from '../../contexts';
import { IconContainer, NextButtonContainer } from './components';

const ImageComponent = Image as React.FC<any>;

export interface IconFormProps {
  advanceStep: VoidFunction;
}

const IconForm: React.FC<IconFormProps> = ({ advanceStep }) => {
  const { product, setProductProperty } = React.useContext(ProductContext)!;

  return (
    <>
      <Box display="flex">
        <IconContainer>
          <label>Small Icon</label>
          <ImageComponent
            size={UploadIconVariant.MEDIUM}
            endpoint="/image/small_icon"
            image={product.smallIconUri}
            update={setProductProperty('smallIconUri')}
          />
        </IconContainer>

        <IconContainer noBorder>
          <label>Large Icon</label>
          <ImageComponent
            size={UploadIconVariant.LARGE}
            endpoint="/image/large_icon"
            image={product.largeIconUri}
            update={setProductProperty('largeIconUri')}
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
