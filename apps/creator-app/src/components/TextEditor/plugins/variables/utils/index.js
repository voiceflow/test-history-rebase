export { default as fromTextConvertor } from './fromTextConvertor';
export { default as toTextAdapter } from './toTextAdapter';

export const cleanUpVariableName = (value = '') => value.trim().replace(/\s/g, '_');
