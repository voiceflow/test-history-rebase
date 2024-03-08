import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import _unionBy from 'lodash/unionBy';
import { normalize } from 'normal-store';
import { createSelector } from 'reselect';

import { activeDiagramIDSelector } from '@/ducks/creatorV2/selectors';
import { all as allEntitiesSelector } from '@/ducks/designer/entity/selectors/crud.select';
import { all as allCMSVariablesSelector } from '@/ducks/designer/variable/variable.select';
import { topicIDsSelector } from '@/ducks/domain/selectors/active';

import { getDiagramByIDSelector, getDiagramsByIDsSelector } from './base';

export const diagramSelector = createSelector([getDiagramByIDSelector, activeDiagramIDSelector], (getDiagram, activeDiagramID) =>
  getDiagram({ id: activeDiagramID })
);

export const typeSelector = createSelector([diagramSelector], (diagram) => diagram?.type ?? null);

export const isTopicSelector = createSelector([typeSelector], (type) => type === BaseModels.Diagram.DiagramType.TOPIC);

export const topicDiagramsSelector = createSelector([topicIDsSelector, getDiagramsByIDsSelector], (topicIDs, getDiagramsByIDs) =>
  getDiagramsByIDs({ ids: topicIDs })
);

export const localVariablesSelector = createSelector(
  [getDiagramByIDSelector, activeDiagramIDSelector],
  (getDiagram, activeDiagramID) => getDiagram({ id: activeDiagramID })?.variables ?? []
);

export const allEntitiesAndVariablesSelector = createSelector(
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

export const entitiesAndVariablesMapSelector = createSelector(allEntitiesAndVariablesSelector, (variables) =>
  Utils.array.createMap(variables, (variable) => variable.id)
);

export const allSlotsAndVariablesNormalizedSelector = createSelector([allEntitiesAndVariablesSelector], (variables) =>
  normalize(variables.map((variable) => ({ id: variable.id, name: variable.name, isSlot: !variable.isVariable })))
);
