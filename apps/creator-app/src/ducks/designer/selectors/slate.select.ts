import { Utils } from '@voiceflow/common';
import type { Entity, Variable } from '@voiceflow/dtos';
import { SlateEditor } from '@voiceflow/ui-next';
import uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { isFeatureEnabledSelector } from '../../feature';
import { all as allEntities } from '../entity/selectors/crud.select';
import { all as allVariables } from '../variable/variable.select';

export const slateVariableItemFactory =
  (variant: SlateEditor.VariableElementVariant) =>
  (value: Entity | Variable): SlateEditor.VariableItem => ({
    id: value.id,
    name: value.name,
    kind: variant,
    color: value.color,
    variant,
  });

export const slateEntities = createSelector(allEntities, (entities) =>
  entities.map(slateVariableItemFactory(SlateEditor.VariableElementVariant.ENTITY))
);

export const slateVariables = createSelector(allVariables, isFeatureEnabledSelector, (variables) =>
  variables.map(slateVariableItemFactory(SlateEditor.VariableElementVariant.VARIABLE))
);

export const uniqueSlateEntitiesAndVariables = createSelector(
  slateEntities,
  slateVariables,
  (slateEntities, slateVariables) => uniqBy([...slateVariables, ...slateEntities], (value) => value.name)
);

export const slateEntitiesMapByID = createSelector(slateEntities, (slateEntities) =>
  Utils.array.createMap(slateEntities, (value) => value.id)
);

export const slateVariablesMapByID = createSelector(slateVariables, (slateVariables) =>
  Utils.array.createMap(slateVariables, (value) => value.id)
);

export const uniqueSlateEntitiesAndVariablesMapByID = createSelector(
  uniqueSlateEntitiesAndVariables,
  (uniqueSlateEntitiesAndVariables) => Utils.array.createMap(uniqueSlateEntitiesAndVariables, (value) => value.id)
);
