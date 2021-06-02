import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// action creators

export const {
  add: addProject,
  update: updateProject,
  patch: patchProject,
  remove: removeProject,
  replace: replaceProjects,
} = createCRUDActionCreators(STATE_KEY);

export const updateProjectName = (id: string, name: string, meta?: object) => patchProject(id, { name }, meta);
