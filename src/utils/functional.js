import { isString } from 'lodash';
import { compose } from 'recompose';

export { compose };

// eslint-disable-next-line lodash/prefer-constant
export const noop = () => null;

export const identity = (value) => value;

export const stringify = (value) => (isString(value) ? value : String(value));
