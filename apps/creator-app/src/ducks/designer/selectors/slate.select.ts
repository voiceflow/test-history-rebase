import { Utils } from '@voiceflow/common';
import type { Entity, Variable } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SlateEditor } from '@voiceflow/ui-next';
import uniqBy from 'lodash/uniqBy';
import { createSelector } from 'reselect';

import { DEFAULT_VARIABLE_COLOR } from '@/constants/variable';

import { allVariablesSelector } from '../../diagramV2/selectors/active';
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

export const slateLegacyVariableFactory =
  (variant: SlateEditor.VariableElementVariant) =>
  (value: string): SlateEditor.VariableItem => ({
    id: value,
    name: value,
    kind: variant,
    color: DEFAULT_VARIABLE_COLOR,
    variant,
  });

export const slateEntities = createSelector(allEntities, (entities) =>
  entities.map(slateVariableItemFactory(SlateEditor.VariableElementVariant.ENTITY))
);

export const slateVariables = createSelector(
  allVariables,
  allVariablesSelector,
  isFeatureEnabledSelector,
  (variables, legacyVariables, isFeatureEnabled) =>
    isFeatureEnabled(Realtime.FeatureFlag.CMS_VARIABLES)
      ? variables.map(slateVariableItemFactory(SlateEditor.VariableElementVariant.VARIABLE))
      : legacyVariables.map(slateLegacyVariableFactory(SlateEditor.VariableElementVariant.VARIABLE))
);

export const uniqueSlateEntitiesAndVariables = createSelector(slateEntities, slateVariables, (slateEntities, slateVariables) =>
  uniqBy([...slateVariables, ...slateEntities], (value) => value.name)
);

export const slateEntitiesMapByID = createSelector(slateEntities, (slateEntities) => Utils.array.createMap(slateEntities, (value) => value.id));

export const slateVariablesMapByID = createSelector(slateVariables, (slateVariables) => Utils.array.createMap(slateVariables, (value) => value.id));

export const uniqueSlateEntitiesAndVariablesMapByID = createSelector(uniqueSlateEntitiesAndVariables, (uniqueSlateEntitiesAndVariables) =>
  Utils.array.createMap(uniqueSlateEntitiesAndVariables, (value) => value.id)
);
