import { Utils } from '@voiceflow/common';
import _unionBy from 'lodash/unionBy';
import { normalize } from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorDiagramSelectors from '@/ducks/creator/diagram/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import { getDiagramByIDSelector, getDiagramsByIDsSelector } from './base';

export const diagramSelector = createSelector(
  [getDiagramByIDSelector, CreatorDiagramSelectors.creatorDiagramIDSelector],
  (getDiagram, activeDiagramID) => (activeDiagramID ? getDiagram(activeDiagramID) : null)
);

export const typeSelector = createSelector([diagramSelector], (diagram) => diagram?.type ?? null);

export const topicDiagramsSelector = createSelector([VersionV2.active.topicsSelector, getDiagramsByIDsSelector], (topics, getDiagramsByIDs) =>
  getDiagramsByIDs(topics.map(({ sourceID }) => sourceID))
);

export const componentDiagramsSelector = createSelector(
  [VersionV2.active.componentsSelector, getDiagramsByIDsSelector],
  (components, getDiagramsByIDs) => getDiagramsByIDs(components.map(({ sourceID }) => sourceID))
);

export const localVariablesSelector = createSelector(
  [getDiagramByIDSelector, CreatorDiagramSelectors.creatorDiagramIDSelector],
  (getDiagram, activeDiagramID) => (activeDiagramID ? getDiagram(activeDiagramID)?.variables ?? [] : [])
);

const allVariablesSelector = createSelector(
  [VersionV2.active.globalVariablesSelector, localVariablesSelector, ProjectV2.active.platformSelector],
  (globalVariables, activeDiagramVariables, platform) => [...getPlatformGlobalVariables(platform), ...globalVariables, ...activeDiagramVariables]
);

export const allSlotsAndVariablesSelector = createSelector([SlotV2.slotNamesSelector, allVariablesSelector], (slotNames, allVariables) =>
  Utils.array.unique([...slotNames, ...allVariables])
);

export const allSlotsAndVariablesNormalizedSelector = createSelector([SlotV2.allSlotsSelector, allVariablesSelector], (slots, allVariables) =>
  normalize(
    _unionBy<{ id: string; name: string; isSlot?: boolean }>(
      [
        ...slots.map((slot) => ({ id: slot.id, name: slot.name, isSlot: true })),
        ...allVariables.map((variable) => ({
          id: variable,
          name: variable,
        })),
      ],
      'name'
    )
  )
);
