import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// action creators

const projectActionCreators = createCRUDActionCreators(STATE_KEY);

/**
 * @deprecated
 */
export const addProject = projectActionCreators.add;
/**
 * @deprecated
 */
export const patchProject = projectActionCreators.patch;
/**
 * @deprecated
 */
export const removeProject = projectActionCreators.remove;
/**
 * @deprecated
 */
export const replaceProjects = projectActionCreators.replace;
/**
 * @deprecated
 */
export const removeManyProjects = projectActionCreators.removeMany;
