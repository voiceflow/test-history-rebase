import { createCRUDActionCreators } from '../utils/crud';
import { STATE_KEY } from './constants';

// action creators

export const { add: addProject, update: updateProject, remove: removeProject, replace: replaceProjects } = createCRUDActionCreators(STATE_KEY);

export const updateProjectName = (id: string, name: string) => updateProject(id, { name }, true);
