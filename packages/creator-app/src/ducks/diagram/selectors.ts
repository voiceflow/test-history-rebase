import { createCRUDSelectors } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

const diagramSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allDiagramsSelector = diagramSelectors.all;
/**
 * @deprecated
 */
export const allDiagramIDsSelector = diagramSelectors.allIDs;
/**
 * @deprecated
 */
export const diagramMapSelector = diagramSelectors.map;
/**
 * @deprecated
 */
export const diagramByIDSelector = diagramSelectors.byID;
/**
 * @deprecated
 */
export const diagramsByIDsSelector = diagramSelectors.findByIDs;
