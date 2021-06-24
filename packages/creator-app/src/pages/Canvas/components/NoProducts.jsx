import { Button, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { safeGraphic } from '@/assets';

import { NoProductLabel, NoProductMessage, PaymentContainer } from '../managers/Payment/components';

const NoProducts = ({ goToNewProduct }) => (
  <PaymentContainer column>
    <img src={safeGraphic} alt="no products" height={48} />
    <NoProductLabel>No Products Exist</NoProductLabel>
    <NoProductMessage>Create a product to add it to this block</NoProductMessage>
    <Button variant="secondary" onClick={stopPropagation(goToNewProduct)}>
      Create Product
    </Button>
  </PaymentContainer>
);

export default NoProducts;
