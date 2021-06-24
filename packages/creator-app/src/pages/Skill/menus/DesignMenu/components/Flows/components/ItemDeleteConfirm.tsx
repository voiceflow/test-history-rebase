import { Alert, AlertVariant } from '@voiceflow/ui';
import React from 'react';

const ItemDeleteConfirm: React.FC = () => (
  <Alert variant={AlertVariant.DANGER} mb={0}>
    Deleting this flow permanently deletes everything inside and can not be recovered
    <br />
    <br />
    Are you sure ?
  </Alert>
);

export default ItemDeleteConfirm;
