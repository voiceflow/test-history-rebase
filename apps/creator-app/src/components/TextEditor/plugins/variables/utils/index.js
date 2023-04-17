export { default as fromTextConvertor } from './fromTextConvertor';
export { default as toTextAdapter } from './toTextAdapter';

const SPACE_REGEXP = /\s/g;

export const cleanUpVariableName = (value = '') => value.trim().replace(SPACE_REGEXP, '_');
