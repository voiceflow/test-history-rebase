import axios from 'axios';

import Normalize from '@/ducks/_normalize';
import { setError } from '@/ducks/modal';
import { fetchLiveVersion, updateVersion } from '@/ducks/version';

import { addProjectToList } from './board';

export const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
export const RESET_PROJECTS = 'RESET_PROJECTS';

const initialState = {
  byId: {},
  allIds: [],
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
      };
    case RESET_PROJECTS:
      return initialState;
    default:
      return state;
  }
}

export const updateProjects = ({ byId, allIds }) => ({
  type: UPDATE_PROJECTS,
  payload: { byId, allIds },
});

const Projects = new Normalize('project_id', 'project', updateProjects);

export const resetProjects = () => ({
  type: RESET_PROJECTS,
});

export const fetchProjects = (team_id) => {
  return async (dispatch) => {
    dispatch(resetProjects());
    if (!team_id) return;

    try {
      let url = '/projects';
      if (team_id !== -1) url = `/team/${team_id}/projects`;
      const projects = (await axios.get(url)).data;
      // NORMALIZE
      dispatch(Projects.create({ data: projects }));
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to retrieve projects'));
    }
  };
};

export const importProject = (team_id, importToken) => {
  return async (dispatch, getState) => {
    try {
      const new_project = (await axios.post(`/importProject/${team_id}/`, { token: importToken })).data;
      const curTeam = getState().team.team_id;
      if (curTeam === team_id) {
        dispatch(Projects.add({ data: new_project }));
        dispatch(addProjectToList(null, new_project.project_id));
      }
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to import project'));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const copyProject = (project_id, team_id, board_id) => {
  return async (dispatch, getState) => {
    try {
      const projects = getState().project;
      const project = projects.byId[project_id];
      if (!project) throw new Error();
      let new_project = null;
      if (project.module) {
        new_project = (await axios.post(`/team/${team_id}/insert/reference/${project.module}`)).data;
      } else {
        new_project = (await axios.post(`/version/${project.skill_id}/copy/team/${team_id}`)).data;
      }

      if (board_id) dispatch(addProjectToList(board_id, new_project.project_id));
      dispatch(Projects.add({ data: new_project }));
    } catch (err) {
      console.error(err);
      dispatch(setError('Unable to copy project'));
      return Promise.reject();
    }
    return Promise.resolve();
  };
};

export const deleteProject = (project_id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/projects/${project_id}`);
      dispatch(Projects.delete({ id: project_id }));
    } catch (err) {
      dispatch(setError('Problem deleting project'));
      console.error(err);
    }
  };
};

export const updateVendorId = (vendorId) => async (dispatch, getState) => {
  try {
    const projectId = getState().skills.skill.project_id;
    const amznId = (await axios.post(`/project/${projectId}/vendor_id`, { vendor_id: vendorId })).data;
    await dispatch(updateVersion('amzn_id', amznId || null));
    await dispatch(updateVersion('vendor_id', vendorId));
    await dispatch(fetchLiveVersion(projectId, amznId));
  } catch (err) {
    dispatch(setError('Unable to update Vendor Id'));
    console.error(err);
  }
};

// export const reorderProjects = (dragIndex, hoverIndex) => {
//   return async (dispatch, getState) => {
//     try{
//       const projects = getState().project.allIds
//       const drag = projects[dragIndex]

//       projects.splice(dragIndex, 1)
//       projects.splice(hoverIndex, 0, drag)

//       dispatch(updateProjects(projects))
//     } catch(err){
//       console.error(err)
//       dispatch(setError('Unable to reorder pojects'))
//       return Promise.reject()
//     }
//     return Promise.resolve()
//   }
// }
