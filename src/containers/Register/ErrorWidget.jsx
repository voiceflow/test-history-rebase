import React from 'react';
import { Alert } from 'reactstrap';
import { isString } from 'lodash';

// eslint-disable-next-line react/display-name
export default ({ error, color }) => (error ? <Alert color={color}>{isString(error) ? error : JSON.stringify(error)}</Alert> : null);
