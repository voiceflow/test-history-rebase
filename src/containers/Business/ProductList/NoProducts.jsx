import React from 'react';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { styled } from '@/hocs';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

function NoProducts({ onClick }) {
  return (
    <Container>
      <SvgIcon icon="noProducts" size={100} />
      <Title>No products exists</Title>
      <Description>Monetize your project with in skill purchases such as consumables and subscriptions.</Description>
      <Button isPrimary varient="contained" color="publish" onClick={onClick}>
        Create a product
      </Button>
    </Container>
  );
}

export default NoProducts;
