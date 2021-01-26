import React from 'react';

import Button from '@/components/Button';
import { stopPropagation } from '@/utils/dom';

import { NoProductLabel, NoProductMessage, PaymentContainer } from '../managers/Payment/components';

const NoProducts = ({ goToNewProduct }) => (
  <PaymentContainer column>
    <img src="/images/safe.svg" alt="no products" height={48} />
    <NoProductLabel>No Products Exist</NoProductLabel>
    <NoProductMessage>Create a product to add it to this block</NoProductMessage>
    <Button variant="secondary" onClick={stopPropagation(goToNewProduct)}>
      Create Product
    </Button>
  </PaymentContainer>
);

export default NoProducts;
