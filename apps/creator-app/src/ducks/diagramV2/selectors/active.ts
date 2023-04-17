import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import _unionBy from 'lodash/unionBy';
import { normalize } from 'normal-store';
import { createSelector } from 'reselect';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DomainSelectors from '@/ducks/domain/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';

import { getDiagramByIDSelector, getDiagramsByIDsSelector } from './base';

export const diagramSelector = createSelector([getDiagramByIDSelector, CreatorV2.activeDiagramIDSelector], (getDiagram, activeDiagramID) =>
  getDiagram({ id: activeDiagramID })
);

export const templateDiagramSelector = createSelector(
  [getDiagramByIDSelector, VersionV2.active.templateDiagramIDSelector],
  (getDiagram, templateDiagramID) => getDiagram({ id: templateDiagramID })
);

export const typeSelector = createSelector([diagramSelector], (diagram) => diagram?.type ?? null);

export const isTopicSelector = createSelector([typeSelector], (type) => type === BaseModels.Diagram.DiagramType.TOPIC);

export const topicDiagramsSelector = createSelector(
  [DomainSelectors.active.topicIDsSelector, getDiagramsByIDsSelector],
  (topicIDs, getDiagramsByIDs) => getDiagramsByIDs({ ids: topicIDs })
);

export const componentDiagramsSelector = createSelector(
  [VersionV2.active.componentsSelector, getDiagramsByIDsSelector],
  (components, getDiagramsByIDs) => getDiagramsByIDs({ ids: components.map(({ sourceID }) => sourceID) })
);

export const localVariablesSelector = createSelector(
  [getDiagramByIDSelector, CreatorV2.activeDiagramIDSelector],
  (getDiagram, activeDiagramID) => getDiagram({ id: activeDiagramID })?.variables ?? []
);

const allVariablesSelector = createSelector(
  [VersionV2.active.globalVariablesSelector, localVariablesSelector, ProjectV2.active.metaSelector],
  (globalVariables, activeDiagramVariables, meta) => [
    ...Platform.Config.getTypeConfig(meta).project.globalVariables,
    ...globalVariables,
    ...activeDiagramVariables,
  ]
);

export const allSlotsAndVariablesSelector = createSelector([SlotV2.allSlotsSelector, allVariablesSelector], (slots, allVariables) => [
  ...slots.map((slot) => ({ id: slot.id, name: slot.name, color: slot.color, isVariable: false })),
  ...allVariables.map((variable) => ({ id: variable, name: variable, color: undefined, isVariable: true })),
]);

export const allSlotNamesAndVariablesSelector = createSelector([allSlotsAndVariablesSelector], (slotsAndVars) =>
  Utils.array.unique(slotsAndVars.map((slotAndVar) => slotAndVar.name))
);

export const allSlotsAndVariablesNormalizedSelector = createSelector([allSlotsAndVariablesSelector], (slotsAndVars) =>
  normalize(
    _unionBy<{ id: string; name: string; isSlot?: boolean }>(
      slotsAndVars.map((slotAndVar) => ({ id: slotAndVar.id, name: slotAndVar.name, isSlot: !slotAndVar.isVariable })),
      'name'
    )
  )
);
