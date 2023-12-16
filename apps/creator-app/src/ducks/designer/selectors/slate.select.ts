import { Utils } from '@voiceflow/common';
import type { Entity, Variable } from '@voiceflow/dtos';
import { SlateEditor } from '@voiceflow/ui-next';
import uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { globalVariablesSelector as allVariables } from '../../versionV2/selectors/active';
import { all as allEntities } from '../entity/selectors/crud.select';

const slateEntityFactory =
  (variant: SlateEditor.VariableElementVariant) =>
  (value: Entity | Variable): SlateEditor.VariableItem => ({
    id: value.id,
    name: value.name,
    kind: variant,
    color: value.color,
    variant,
  });

const slateVariableFactory =
  (variant: SlateEditor.VariableElementVariant) =>
  (value: string): SlateEditor.VariableItem => ({
    id: value,
    name: value,
    kind: variant,
    color: '#515A63',
    variant,
  });

export const slateEntities = createSelector(allEntities, (entities) => entities.map(slateEntityFactory(SlateEditor.VariableElementVariant.ENTITY)));

export const slateVariables = createSelector(allVariables, (variables) =>
  variables.map(slateVariableFactory(SlateEditor.VariableElementVariant.VARIABLE))
);

export const uniqueSlateEntitiesAndVariables = createSelector(slateEntities, slateVariables, (slateEntities, slateVariables) =>
  uniqBy([...slateEntities, ...slateVariables], (value) => value.name)
);

export const slateEntitiesMapByID = createSelector(slateEntities, (slateEntities) => Utils.array.createMap(slateEntities, (value) => value.id));

export const slateVariablesMapByID = createSelector(slateVariables, (slateVariables) => Utils.array.createMap(slateVariables, (value) => value.id));

export const uniqueSlateEntitiesAndVariablesMapByID = createSelector(uniqueSlateEntitiesAndVariables, (uniqueSlateEntitiesAndVariables) =>
  Utils.array.createMap(uniqueSlateEntitiesAndVariables, (value) => value.id)
);
