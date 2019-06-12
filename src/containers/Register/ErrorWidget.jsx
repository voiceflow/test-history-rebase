import React from 'react';
import { Alert } from 'reactstrap';

// eslint-disable-next-line react/display-name
export default ({ error, color }) => (error ? <Alert color={color}>{error}</Alert> : null);
