import _uniq from 'lodash/uniq';
import { createSelector } from 'reselect';

import { GLOBAL_VARIABLES } from '@/constants';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as VariableSet from '@/ducks/variableSet';
import * as Viewport from '@/ducks/viewport';
import * as Workspace from '@/ducks/workspace';
import { getAlternativeColor } from '@/utils/colors';
import { getSlotTypes } from '@/utils/slot';

export const activeDiagramVariablesSelector = createSelector(
  Skill.activeDiagramIDSelector,
  VariableSet.variablesByDiagramIDSelector,
  (diagramID, getVariables) => getVariables(diagramID)
);

export const activeDiagramViewportSelector = createSelector(
  Skill.activeDiagramIDSelector,
  Viewport.viewportByIDSelector,
  (diagramID, getViewportByID) => getViewportByID(diagramID)
);

export const allVariablesSelector = createSelector(
  Skill.globalVariablesSelector,
  activeDiagramVariablesSelector,
  Slot.slotNamesSelector,
  (globalVariables, activeDiagramVariables, slotNames) => _uniq([...slotNames, ...GLOBAL_VARIABLES, ...globalVariables, ...activeDiagramVariables])
);

export const activeSlotTypes = createSelector(Skill.activeSkillSelector, ({ locales, platform, publishInfo }) =>
  getSlotTypes(locales, platform, publishInfo)
);

export const activeProjectSelector = createSelector(Skill.activeProjectIDSelector, Project.projectByIDSelector, (projectID, getProject) =>
  getProject(projectID)
);

export const isLoggingInSelector = createSelector(
  Session.authTokenSelector,
  Account.userSelector,
  (token, user) => token && user.creator_id === null
);

// Realtime

/**
 * gets a count of users for the active project
 */
export const projectViewerCountSelector = createSelector(Realtime.realtimeLocksSelector, Workspace.activeWorkspaceSelector, (locks, team) => {
  if (!locks || !team) {
    return 1;
  }

  return Object.values(locks.users).reduce((acc, diagramLocks) => {
    Object.keys(diagramLocks || {}).forEach((tabID) => acc.add(tabID));

    return acc;
  }, new Set()).size;
});

export const isOnlyViewerSelector = createSelector(projectViewerCountSelector, (projectViewerCount) => projectViewerCount === 1);

/**
 * gets all members for a given diagram
 */
export const diagramViewersSelector = createSelector(
  Realtime.realtimeLocksSelector,
  Workspace.workspaceMemberSelector,
  (locks, getWorkspaceMember) => (diagramID) => {
    if (!locks || !diagramID) {
      return [];
    }

    return Object.entries(locks.users[diagramID] || {}).map(([tabID, creatorID]) => ({
      tabID,
      ...getWorkspaceMember(creatorID),
      color: getAlternativeColor(tabID),
    }));
  }
);

/**
 * gets all members in the active diagram
 */
export const activeDiagramViewersSelector = createSelector(diagramViewersSelector, Skill.activeDiagramIDSelector, (getViewers, diagramID) =>
  getViewers(diagramID)
);

export const diagramViewersLookupSelector = createSelector(
  Realtime.realtimeLocksSelector,
  Workspace.workspaceMemberSelector,
  (locks, getWorkspaceMember) => {
    if (!locks || !getWorkspaceMember) {
      return {};
    }

    const acc = [];
    Object.values(locks.users).forEach((usersInDiagram) =>
      // eslint-disable-next-line array-callback-return
      Object.entries(usersInDiagram).map(([tabID, creatorID]) => {
        acc[tabID] = { ...getWorkspaceMember(creatorID), color: getAlternativeColor(tabID) };
      })
    );

    return acc;
  }
);

// Flow
export const rootFlowStructureSelector = createSelector(
  Diagram.flowStructureSelector,
  Skill.rootDiagramIDSelector,
  (getFlowStructure, rootDiagramID) => getFlowStructure(rootDiagramID)
);

export const unusedDiagramsSelector = createSelector(
  rootFlowStructureSelector,
  Diagram.allDiagramIDsSelector,
  Diagram.diagramsByIDsSelector,
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
  Creator.portByIDSelector,
  Creator.linksByPortIDSelector,
  (platform, getPortByID, getAllLinksByPortID) => (portID) =>
    getAllLinksByPortID(portID).some((link) => {
      const sourcePort = getPortByID(link.source.portID);
      return !sourcePort.platform || sourcePort.platform === platform;
    })
);
