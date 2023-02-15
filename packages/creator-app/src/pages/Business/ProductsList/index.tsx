import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as ProductV2 from '@/ducks/productV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useSelector } from '@/hooks';

import { BackButtonContainer, BackLink, Container } from '../components';
import { List } from './components';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const products = useSelector(ProductV2.allProductsSelector);
  const goToNewProduct = useDispatch(Router.goToNewProduct, versionID);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  return (
    <>
      <BackButtonContainer>
        <BackLink onClick={goToCurrentCanvas}>
          <SvgIcon icon="arrowLeft" color="currentColor" />
          Return to Canvas
        </BackLink>
      </BackButtonContainer>

      {products.length === 0 ? (
        <NoProducts onClick={goToNewProduct} />
      ) : (
        <Container>
          <List>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </List>

          <Button onClick={goToNewProduct}>Add Product</Button>
        </Container>
      )}
    </>
  );
};

export default ProductList;
