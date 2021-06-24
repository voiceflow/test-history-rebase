import { Button, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Product from '@/ducks/product';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';

import { BackButtonContainer, BackLink, Container } from '../components';
import { List } from './components';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';

const ProductList = ({ products, goToNewProduct, goToCurrentCanvas }) => (
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
          {products.map((product, index) => (
            <ProductCard key={index} productID={product.id} product={product} />
          ))}
        </List>

        <Button isPrimary iconPosition="right" onClick={goToNewProduct}>
          Add Product
        </Button>
      </Container>
    )}
  </>
);

const mapStateToProps = {
  products: Product.allProductsSelector,
  versionID: Session.activeVersionIDSelector,
};

const mapDispatchToProps = {
  goToNewProduct: Router.goToNewProduct,
  goToCurrentCanvas: Router.goToCurrentCanvas,
};

const mergeProps = ({ versionID }, { goToNewProduct }) => ({
  goToNewProduct: () => goToNewProduct(versionID),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProductList);
