import _isString from 'lodash/isString';
import React from 'react';

import { generateLocalKey } from '@/utils/key';

const generateKey = (keygen: (value: any) => string, value: any) => (_isString(value) ? value : keygen(value));

// eslint-disable-next-line import/prefer-default-export
export function useKeygen() {
  const keygen = React.useRef(generateLocalKey());

  return (value: any) => generateKey(keygen.current, value);
}
