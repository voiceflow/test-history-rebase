/* eslint-disable no-shadow */
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import { allProductsSelector } from '@/ducks/product';
import { goToCurrentCanvas, goToNewProduct } from '@/ducks/router';
import { connect } from '@/hocs';

import { BackButtonContainer, BackLink, Container } from '../components';
import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { List } from './components';

function ProductList({ products, goToNewProduct, goToCurrentCanvas }) {
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
}

const mapStateToProps = {
  products: allProductsSelector,
};

const mapDispatchToProps = {
  goToNewProduct,
  goToCurrentCanvas,
};

const mergeProps = (_, { goToNewProduct }, { skillID }) => ({
  goToNewProduct: () => goToNewProduct(skillID),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ProductList);
