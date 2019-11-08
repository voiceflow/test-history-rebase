import React from 'react';

import ProductSelect from '@/components/ProductSelect';
import VariableSelect from '@/componentsV2/VariableSelect';
import { PermissionType, ProductType } from '@/constants';
import { allProductsSelector } from '@/ducks/product';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';

const PERMISSION_LABEL = {
  [PermissionType.USER_EMAIL]: 'User Email',
  [PermissionType.USER_NAME]: 'User Name',
  [PermissionType.USER_PHONE]: 'User Phone Number',
  [PermissionType.ACCOUNT_LINKING]: 'Access Token',
};

const VariableLabel = ({ canVariableMap, permission, products, onUpdate }) => {
  const updateVariable = React.useCallback((mapTo, mapToLabel) => onUpdate({ mapTo, mapToLabel }), [onUpdate]);
  const updateProduct = React.useCallback((product) => onUpdate({ product }), [onUpdate]);

  if (canVariableMap) {
    return (
      <>
        <label>{PERMISSION_LABEL[permission.selected] || null}</label>
        <VariableSelect className="map-box" value={permission.mapTo} onChange={updateVariable} />
      </>
    );
  }

  if (permission.selected !== PermissionType.PRODUCT) {
    return null;
  }

  let consumable;
  if (permission.product) {
    const product = products.find(({ id }) => id === permission.product);

    if (product.type === ProductType.CONSUMABLE) {
      consumable = true;
    }
  }

  return (
    <>
      <label>Check if Product Purchased</label>
      <ProductSelect value={permission.product} onChange={updateProduct} />
      {consumable && (
        <>
          <label>Map Purchase Quantity To</label>
          <VariableSelect className="map-box" value={permission.mapTo} onChange={updateVariable} />
        </>
      )}
    </>
  );
};

const mapStateToProps = {
  products: allProductsSelector,
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(VariableLabel);
