import React from 'react';

import ProductSelect from '@/components/ProductSelect';
import VariableSelect from '@/componentsV2/VariableSelect';
import { PERMISSIONS_WITH_VARIABLE_MAPS, PermissionType, ProductType } from '@/constants';
import { FormControl } from '@/containers/CanvasV2/components/Editor';
import * as Product from '@/ducks/product';
import { connect } from '@/hocs';

const PermissionInfo = ({ permission, onChange, getProduct }) => {
  const isProductPermission = permission.selected === PermissionType.PRODUCT;
  const isMappable = permission.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(permission.selected);

  const updateVariable = React.useCallback((mapTo) => onChange({ mapTo }), [onChange]);
  const updateProduct = React.useCallback((product) => onChange({ product }), [onChange]);

  if (isProductPermission) {
    const product = getProduct(permission.product);
    const isConsumable = product?.type === ProductType.CONSUMABLE;

    return (
      <>
        <FormControl label="Check if Product Purchased">
          <ProductSelect value={permission.product} onChange={updateProduct} />
        </FormControl>
        {isConsumable && (
          <FormControl label="Map Purchase Quantity To">
            <VariableSelect value={permission.mapTo} onChange={updateVariable} />
          </FormControl>
        )}
      </>
    );
  }

  if (isMappable) {
    return (
      <FormControl label="Map Info to Variable">
        <VariableSelect value={permission.mapTo} onChange={updateVariable} />
      </FormControl>
    );
  }

  return null;
};

const mapStateToProps = {
  getProduct: Product.productByIDSelector,
};

export default connect(mapStateToProps)(PermissionInfo);
