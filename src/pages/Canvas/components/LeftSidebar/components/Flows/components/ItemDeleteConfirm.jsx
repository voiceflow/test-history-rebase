import React from 'react';
import { Alert } from 'reactstrap';

const ItemDeleteConfirm = () => (
  <Alert color="danger" className="mb-0">
    Deleting this flow permanently deletes everything inside and can not be recovered
    <br />
    <br />
    Are you sure ?
  </Alert>
);

export default ItemDeleteConfirm;
