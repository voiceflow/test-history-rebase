import React from 'react';

import Alert, { AlertVariant } from '@/components/Alert';

const ItemDeleteConfirm: React.FC = () => (
  <Alert variant={AlertVariant.DANGER} mb={0}>
    Deleting this flow permanently deletes everything inside and can not be recovered
    <br />
    <br />
    Are you sure ?
  </Alert>
);

export default ItemDeleteConfirm;
