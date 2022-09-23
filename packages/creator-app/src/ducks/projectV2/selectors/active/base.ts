import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  getProjectByID({ id: projectID })
);

export const platformSelector = createSelector([projectSelector], (project) => project?.platform || VoiceflowConstants.PlatformType.VOICEFLOW);

export const projectTypeSelector = createSelector([projectSelector], (project) => project?.type || VoiceflowConstants.ProjectType.VOICE);

export const metaSelector = createSelector([projectTypeSelector, platformSelector], (type, platform): Realtime.ProjectMeta => ({ type, platform }));

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const idSelector = Session.activeProjectIDSelector;

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || BaseModels.Project.LinkType.STRAIGHT);

export const customThemesSelector = createSelector([projectSelector], (project) => project?.customThemes || []);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === BaseModels.Project.LinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);

export const liveVersionSelector = createSelector([projectSelector], (project) => project?.liveVersion);

export const vfVersionSelector = createSelector([projectSelector], (project) => project?._version ?? Realtime.CURRENT_PROJECT_VERSION);

export const platformDataSelector = createSelector([projectSelector], (project) => project?.platformData ?? {});
