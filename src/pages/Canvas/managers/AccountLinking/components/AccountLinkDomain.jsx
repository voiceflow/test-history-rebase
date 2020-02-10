import React from 'react';

import DomainTooltip from './DomainTooltip';
import MultiFields from './MultiFields';

const AccountLinkDomain = ({ data, handleAdd, handleRemove, handleChange }) => (
  <MultiFields
    type="domains"
    tooltipContent={<DomainTooltip />}
    onAdd={handleAdd}
    onRemove={handleRemove}
    handleChange={handleChange}
    fields={data.domains}
  />
);

export default AccountLinkDomain;
