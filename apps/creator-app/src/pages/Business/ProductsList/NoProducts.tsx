import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { safeGraphic } from '@/assets';
import { styled } from '@/hocs/styled';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Title = styled.p`
  margin: 24px 0;
  color: #132144;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
`;

const Description = styled.p`
  width: 350px;
  margin-bottom: 24px;
  color: #8da2b5;
  font-size: 15px;
  text-align: center;
`;

export interface NoProductsProps {
  onClick: React.MouseEventHandler;
}

const NoProducts: React.FC<NoProductsProps> = ({ onClick }) => (
  <Container>
    <img src={safeGraphic} alt="no products" height={100} />
    <Title>No products exists</Title>
    <Description>Monetize your assistant with in-skill purchases such as consumables and subscriptions.</Description>
    <Button variant={ButtonVariant.PRIMARY} onClick={onClick}>
      Create a product
    </Button>
  </Container>
);

export default NoProducts;
