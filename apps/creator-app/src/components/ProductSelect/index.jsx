import { Select } from '@voiceflow/ui';
import React from 'react';

import * as ProductV2 from '@/ducks/productV2';
import { useSelector } from '@/hooks';

const ProductSelect = ({ value, onChange }) => {
  const products = useSelector(ProductV2.allProductsSelector);
  const selected = useSelector(ProductV2.productByIDSelector, { id: value });

  return (
    <Select
      value={selected ? selected.name : null}
      placeholder={products.length > 0 ? 'Select Product' : 'No Products Exist'}
      onSelect={onChange}
      options={products.map((product) => ({ value: product.id, label: product.name }))}
      getOptionValue={(option) => option.value}
      renderOptionLabel={(option) => option.label}
    />
  );
};

export default ProductSelect;
