import { createSelector } from 'reselect';

import { GLOBAL_VARIABLES } from '@/constants';
import { userSelector } from '@/ducks/account';
import { linksByPortIDSelector, portByIDSelector } from '@/ducks/creator';
import { allDiagramIDsSelector, diagramsByIDsSelector, flowStructureSelector } from '@/ducks/diagram';
import { projectByIDSelector } from '@/ducks/project';
import { realtimeLocksSelector } from '@/ducks/realtime';
import { authTokenSelector } from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { activeTeamSelector } from '@/ducks/team';
import { variablesByDiagramIDSelector } from '@/ducks/variableSet';
import { viewportByIDSelector } from '@/ducks/viewport';
import { getSlotTypes } from '@/utils/slot';

export const activeDiagramVariablesSelector = createSelector(
  Skill.activeDiagramIDSelector,
  variablesByDiagramIDSelector,
  (diagramID, getVariables) => getVariables(diagramID)
);

export const activeDiagramViewportSelector = createSelector(
  Skill.activeDiagramIDSelector,
  viewportByIDSelector,
  (diagramID, getViewportByID) => getViewportByID(diagramID)
);

export const allVariablesSelector = createSelector(
  Skill.globalVariablesSelector,
  activeDiagramVariablesSelector,
  (globalVariables, activeDiagramVariables) => [...GLOBAL_VARIABLES, ...globalVariables, ...activeDiagramVariables]
);

export const activeSlotTypes = createSelector(
  Skill.activeSkillSelector,
  ({ locales, platform, publishInfo }) => getSlotTypes(locales, platform, publishInfo)
);

export const activeProjectSelector = createSelector(
  Skill.activeProjectIDSelector,
  projectByIDSelector,
  (projectID, getProject) => getProject(projectID)
);

export const isLoggingInSelector = createSelector(
  authTokenSelector,
  userSelector,
  (token, user) => token && user.creator_id === null
);

export const diagramViewersSelector = createSelector(
  realtimeLocksSelector,
  activeTeamSelector,
  (locks, team) => {
    if (!locks || !team) {
      return [];
    }

    return Object.keys(locks.users).map((tabID) => {
      const user = locks.users[tabID];

      return { tabID, ...user, ...team.members.find((member) => member.name === user.name) };
    });
  }
);

export const diagramViewersLookupSelector = createSelector(
  realtimeLocksSelector,
  activeTeamSelector,
  (locks, team) => {
    if (!locks || !team) {
      return {};
    }

    return Object.keys(locks.users).reduce((acc, tabID) => {
      const user = locks.users[tabID];

      acc[tabID] = { ...user, ...team.members.find((member) => member.name === user.name) };

      return acc;
    }, {});
  }
);

export const rootFlowStructureSelector = createSelector(
  flowStructureSelector,
  Skill.rootDiagramIDSelector,
  (getFlowStructure, rootDiagramID) => getFlowStructure(rootDiagramID)
);

export const unusedDiagramsSelector = createSelector(
  rootFlowStructureSelector,
  allDiagramIDsSelector,
  diagramsByIDsSelector,
  (rootFlow, diagramIDs, getDiagrams) => {
    const unusedDiagramIDs = new Set(diagramIDs);

    function removeDiagrams(flow) {
      if (unusedDiagramIDs.has(flow.id)) {
        unusedDiagramIDs.delete(flow.id);
        flow.children.forEach(removeDiagrams);
      }
    }

    removeDiagrams(rootFlow);

    return getDiagrams(Array.from(unusedDiagramIDs));
  }
);

export const hasActiveLinksSelector = createSelector(
  Skill.activePlatformSelector,
  portByIDSelector,
  linksByPortIDSelector,
  (platform, getPortByID, getAllLinksByPortID) => (portID) =>
    getAllLinksByPortID(portID).some((link) => {
      const sourcePort = getPortByID(link.source.portID);
      return !sourcePort.platform || sourcePort.platform === platform;
    })
);
