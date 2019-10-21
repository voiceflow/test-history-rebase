import React from 'react';

import { generateLocalKey } from '@/utils/key';

const generateKey = (keygen, value) => (typeof value === 'string' ? value : keygen(value));

class KeyedComponent extends React.PureComponent {
  genLocalKey = generateLocalKey();

  // eslint-disable-next-line no-underscore-dangle
  genKey = this.props.getKey || ((value) => generateKey(this.genLocalKey, value));
}

export default KeyedComponent;

export function useKeygen() {
  const keygen = React.useRef(generateLocalKey());

  return (value) => generateKey(keygen.current, value);
}
