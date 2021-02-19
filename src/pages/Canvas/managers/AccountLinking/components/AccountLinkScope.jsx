import React from 'react';

import MultiFields from './MultiFields';
import ScopeTooltip from './ScopeTooltip';

const AccountLinkScope = ({ data, handleAdd, handleRemove, handleChange }) => (
  <MultiFields
    type="scopes"
    tooltipContent={<ScopeTooltip />}
    handleChange={handleChange}
    onAdd={handleAdd}
    onRemove={handleRemove}
    fields={data.scopes}
  />
);

export default AccountLinkScope;
