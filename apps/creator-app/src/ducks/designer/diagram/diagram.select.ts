import { createDesignerCRUDSelectors, createDesignerSelector } from '../utils';
import { STATE_KEY } from './diagram.state';

const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);
