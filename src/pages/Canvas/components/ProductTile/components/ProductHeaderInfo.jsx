import React from 'react';

import { PRODUCT_TYPES } from '@/pages/Business/Product/GuidedSteps/PricingModel';

import { ProductDetails, ProductName, ProductType } from '../../../managers/Payment/components';

const ProductHeaderInfo = ({ title, name, subscriptionFrequency, localeNames, type, edit }) => (
  <ProductDetails>
    {edit ? (
      <ProductName>{title}</ProductName>
    ) : (
      <>
        <ProductName>{name}</ProductName>
        <ProductType>
          {PRODUCT_TYPES.find(({ value }) => value === type)?.label}
          {subscriptionFrequency && ` (${subscriptionFrequency})`} - {localeNames?.join(', ')}
        </ProductType>
      </>
    )}
  </ProductDetails>
);

export default ProductHeaderInfo;
