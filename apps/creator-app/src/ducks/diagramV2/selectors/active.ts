import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import _unionBy from 'lodash/unionBy';
import { normalize } from 'normal-store';
import { createSelector } from 'reselect';

import { activeDiagramIDSelector } from '@/ducks/creatorV2/selectors';
import { all as allEntitiesSelector } from '@/ducks/designer/entity/selectors/crud.select';
import { all as allCMSVariablesSelector } from '@/ducks/designer/variable/variable.select';
import { topicIDsSelector } from '@/ducks/domain/selectors/active';
import { featureSelectorFactory } from '@/ducks/feature';
import { metaSelector } from '@/ducks/projectV2/selectors/active';
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

/**
 * @deprecated should be removed with CMS_VARIABLES feature flag
 */
export const allVariablesSelector = createSelector(
  [globalVariablesSelector, localVariablesSelector, metaSelector],
  (globalVariables, activeDiagramVariables, meta) => [
    ...Platform.Config.getTypeConfig(meta).project.globalVariables,
    ...globalVariables,
    ...activeDiagramVariables,
  ]
);

const legacyAllEntitiesAndVariablesSelector = createSelector(
  [allEntitiesSelector, allVariablesSelector],
  (slots, allVariables): Array<{ id: string; name: string; color?: string; isVariable: boolean }> =>
    _unionBy(
      [
        ...slots.map((slot) => ({ id: slot.id, name: slot.name, color: slot.color, isVariable: false })),
        ...allVariables.map((variable) => ({ id: variable, name: variable, color: undefined, isVariable: true })),
      ],
      (item) => item.name
    )
);

const newAllEntitiesAndVariablesSelector = createSelector(
  [allEntitiesSelector, allCMSVariablesSelector, localVariablesSelector],
  (entities, variables, localVariables): Array<{ id: string; name: string; color?: string; isVariable: boolean }> =>
    _unionBy(
      [
        ...entities.map((entity) => ({ id: entity.id, name: entity.name, color: entity.color, isVariable: false })),
        ...variables.map((variable) => ({ id: variable.id, name: variable.name, color: variable.color, isVariable: true })),
        ...localVariables.map((variable) => ({ id: variable, name: variable, color: undefined, isVariable: true })),
      ],
      (item) => item.name
    )
);

export const allEntitiesAndVariablesSelector = featureSelectorFactory(Realtime.FeatureFlag.CMS_VARIABLES)(
  legacyAllEntitiesAndVariablesSelector,
  newAllEntitiesAndVariablesSelector
);

export const entitiesAndVariablesMapSelector = createSelector(allEntitiesAndVariablesSelector, (variables) =>
  Utils.array.createMap(variables, (variable) => variable.id)
);

export const allSlotsAndVariablesNormalizedSelector = createSelector([allEntitiesAndVariablesSelector], (variables) =>
  normalize(variables.map((variable) => ({ id: variable.id, name: variable.name, isSlot: !variable.isVariable })))
);
