import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import _unionBy from 'lodash/unionBy';
import { normalize } from 'normal-store';
import { createSelector } from 'reselect';

import { activeDiagramIDSelector } from '@/ducks/creatorV2/selectors';
import { all as allEntitiesSelector } from '@/ducks/designer/entity/selectors/crud.select';
import { topicIDsSelector } from '@/ducks/domain/selectors/active';
import { featureSelectorFactory } from '@/ducks/feature';
import { metaSelector } from '@/ducks/projectV2/selectors/active';
import { allSlotsSelector } from '@/ducks/slotV2/selectors';
import { componentsSelector, globalVariablesSelector, templateDiagramIDSelector } from '@/ducks/versionV2/selectors/active';

import { getDiagramByIDSelector, getDiagramsByIDsSelector } from './base';

export const diagramSelector = createSelector([getDiagramByIDSelector, activeDiagramIDSelector], (getDiagram, activeDiagramID) =>
  getDiagram({ id: activeDiagramID })
);

export const templateDiagramSelector = createSelector([getDiagramByIDSelector, templateDiagramIDSelector], (getDiagram, templateDiagramID) =>
  getDiagram({ id: templateDiagramID })
);

export const typeSelector = createSelector([diagramSelector], (diagram) => diagram?.type ?? null);

export const isTopicSelector = createSelector([typeSelector], (type) => type === BaseModels.Diagram.DiagramType.TOPIC);

export const topicDiagramsSelector = createSelector([topicIDsSelector, getDiagramsByIDsSelector], (topicIDs, getDiagramsByIDs) =>
  getDiagramsByIDs({ ids: topicIDs })
);

export const componentDiagramsSelector = createSelector([componentsSelector, getDiagramsByIDsSelector], (components, getDiagramsByIDs) =>
  getDiagramsByIDs({ ids: components.map(({ sourceID }) => sourceID) })
);

export const localVariablesSelector = createSelector(
  [getDiagramByIDSelector, activeDiagramIDSelector],
  (getDiagram, activeDiagramID) => getDiagram({ id: activeDiagramID })?.variables ?? []
);

const allVariablesSelector = createSelector(
  [globalVariablesSelector, localVariablesSelector, metaSelector],
  (globalVariables, activeDiagramVariables, meta) => [
    ...Platform.Config.getTypeConfig(meta).project.globalVariables,
    ...globalVariables,
    ...activeDiagramVariables,
  ]
);

const entitiesSelector = featureSelectorFactory(FeatureFlag.V2_CMS)(allSlotsSelector, allEntitiesSelector);

export const allSlotsAndVariablesSelector = createSelector([entitiesSelector, allVariablesSelector], (slots, allVariables) => [
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
