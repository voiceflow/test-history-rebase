import React from 'react';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { stopPropagation } from '@/utils/dom';

import { NoProductLabel, NoProductMessage, PaymentContainer } from '../managers/Payment/components';

function NoProducts({ goToNewProduct }) {
  return (
    <PaymentContainer column>
      <SvgIcon icon="safe" size="auto" />
      <NoProductLabel>No Products Exist</NoProductLabel>
      <NoProductMessage>Create a product to add it to this block</NoProductMessage>
      <Button variant="secondary" onClick={stopPropagation(goToNewProduct)}>
        Create Product
      </Button>
    </PaymentContainer>
  );
}

export default NoProducts;
