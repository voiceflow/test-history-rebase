export { default as toTextAdapter } from './toTextAdapter';
export { default as fromTextConvertor } from './fromTextConvertor';

const SPACE_REGEXP = /\s/g;

export const cleanUpVariableName = (value = '') => value.trim().replace(SPACE_REGEXP, '_');
