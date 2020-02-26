import { isString } from 'lodash';
import { compose } from 'recompose';

export { compose };

// eslint-disable-next-line lodash/prefer-constant
export const noop = () => null;

export const identity = <T>(value: T): T => value;

export const stringify = (value: any): string => (isString(value) ? value : String(value));
