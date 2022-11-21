import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getProjectByIDSelector } from '../base';

export const projectSelector = createSelector([Session.activeProjectIDSelector, getProjectByIDSelector], (projectID, getProjectByID) =>
  getProjectByID({ id: projectID })
);

export const nluTypeSelector = createSelector([projectSelector], (project) => project?.nlu || Platform.Constants.NLUType.VOICEFLOW);

export const platformSelector = createSelector([projectSelector], (project) => project?.platform || Platform.Constants.PlatformType.VOICEFLOW);

export const projectTypeSelector = createSelector([projectSelector], (project) => project?.type || Platform.Constants.ProjectType.VOICE);

export const metaSelector = createSelector(
  [nluTypeSelector, projectTypeSelector, platformSelector],
  (nlu, type, platform): Realtime.ProjectMeta => ({ nlu, type, platform })
);

export const projectConfigSelector = createSelector([metaSelector], (meta) => Platform.Config.getTypeConfig(meta));

export const nameSelector = createSelector([projectSelector], (project) => project?.name ?? null);

export const idSelector = Session.activeProjectIDSelector;

export const linkTypeSelector = createSelector([projectSelector], (project) => project?.linkType || BaseModels.Project.LinkType.STRAIGHT);

export const customThemesSelector = createSelector([projectSelector], (project) => project?.customThemes || []);

export const isStraightLinksSelector = createSelector([linkTypeSelector], (linkType) => linkType === BaseModels.Project.LinkType.STRAIGHT);

export const isLiveSelector = createSelector([projectSelector], (project) => !!project?.isLive);

export const liveVersionSelector = createSelector([projectSelector], (project) => project?.liveVersion);

export const vfVersionSelector = createSelector([projectSelector], (project) => project?._version ?? Realtime.CURRENT_PROJECT_VERSION);

export const platformDataSelector = createSelector([projectSelector], (project) => project?.platformData ?? {});
