import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// action creators

export const {
  add: addProject,
  patch: patchProject,
  remove: removeProject,
  replace: replaceProjects,
  removeMany: removeManyProjects,
} = createCRUDActionCreators(STATE_KEY);

export const updateProjectName = (id: string, name: string, meta?: object) => patchProject(id, { name }, meta);
