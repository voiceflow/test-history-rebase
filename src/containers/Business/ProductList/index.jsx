import React from 'react';
import { connect } from 'react-redux';

import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';

import NoProducts from './NoProducts';
import ProductCard from './ProductCard';
import { BackButtonContainer, BackLink, List, ProductListWrapper } from './styled';

function ProductList({ products, skillID, diagramID, history, ...restProps }) {
  return (
    <ProductListWrapper>
      <BackButtonContainer>
        <BackLink to={`/canvas/${skillID}/${diagramID}`}>
          <SvgIcon icon="arrowLeft" color="currentColor" />
          Return to Canvas
        </BackLink>
      </BackButtonContainer>

      {products.length === 0 ? (
        <NoProducts onClick={() => history.push(`/tools/${skillID}/product/new`)} />
      ) : (
        <>
          <List>
            {products.map((product, index) => (
              <ProductCard product={product} key={index} skillID={skillID} history={history} {...restProps} />
            ))}
          </List>

          <Button isPrimary iconPosition="right" onClick={() => history.push(`/tools/${skillID}/product/new`)}>
            Add Product
          </Button>
        </>
      )}
    </ProductListWrapper>
  );
}

const mapStateToProps = ({ skills, products }) => ({
  products: products.products,
  skillID: skills.skill.skill_id,
  diagramID: skills.skill.diagram,
});

export default connect(mapStateToProps)(ProductList);
