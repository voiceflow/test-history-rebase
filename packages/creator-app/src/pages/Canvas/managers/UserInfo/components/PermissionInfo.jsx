import { Constants, Node } from '@voiceflow/alexa-types';
import React from 'react';

import ProductSelect from '@/components/ProductSelect';
import VariableSelect from '@/components/VariableSelect';
import { PERMISSIONS_WITH_VARIABLE_MAPS } from '@/constants';
import * as ProductV2 from '@/ducks/productV2';
import { useSelector } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';

const PermissionInfo = ({ permission, onChange }) => {
  const product = useSelector((state) => ProductV2.productByIDSelector(state, { id: permission.product }));
  const isProductPermission = permission.selected === Node.PermissionType.UNOFFICIAL_PRODUCT;
  const isMappable = permission.selected && PERMISSIONS_WITH_VARIABLE_MAPS.includes(permission.selected);

  const updateVariable = React.useCallback((mapTo) => onChange({ mapTo }), [onChange]);
  const updateProduct = React.useCallback((productID) => onChange({ product: productID }), [onChange]);

  if (isProductPermission) {
    const isConsumable = product?.type === Constants.ProductType.CONSUMABLE;

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

export default PermissionInfo;
