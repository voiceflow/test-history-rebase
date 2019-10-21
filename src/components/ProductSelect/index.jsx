import React from 'react';

import Select from '@/components/Select';
import { allProductsSelector, productByIDSelector } from '@/ducks/product';
import { connect } from '@/hocs';

const ProductSelect = ({ selected, onChange, products }) => (
  <Select
    classNamePrefix="select-box"
    value={selected ? { value: selected.id, label: selected.name } : null}
    placeholder={products.length > 0 ? 'Select Product' : 'No Products Exist'}
    onChange={(result) => onChange(result.value)}
    options={products.map((product) => ({ value: product.id, label: product.name }))}
  />
);

const mapStateToProps = {
  products: allProductsSelector,
  selected: productByIDSelector,
};

const mergeProps = ({ selected: getProductByID }, _, { value }) => ({
  selected: value && getProductByID(value),
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(ProductSelect);
