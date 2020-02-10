import React from 'react';

import Select from '@/components/Select';
import { allProductsSelector, productByIDSelector } from '@/ducks/product';
import { connect } from '@/hocs';

const ProductSelect = ({ selected, onChange, products }) => (
  <Select
    value={selected ? selected.name : null}
    placeholder={products.length > 0 ? 'Select Product' : 'No Products Exist'}
    onSelect={onChange}
    options={products.map((product) => ({ value: product.id, label: product.name }))}
    getOptionValue={(option) => option.value}
    renderOptionLabel={(option) => option.label}
  />
);

const mapStateToProps = {
  products: allProductsSelector,
  selected: productByIDSelector,
};

const mergeProps = ({ selected: getProductByID }, _, { value }) => ({
  selected: value && getProductByID(value),
});

export default connect(mapStateToProps, null, mergeProps)(ProductSelect);
