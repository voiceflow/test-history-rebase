import { compose } from 'recompose';

export { compose };

// eslint-disable-next-line lodash/prefer-constant
export const noop = () => null;

export const identity = (value) => value;

export const stringify = (value) => (typeof value === 'string' ? value : String(value));
