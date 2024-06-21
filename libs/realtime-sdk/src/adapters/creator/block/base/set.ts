import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { createMultiAdapter } from 'bidirectional-adapter';

import { NodeData } from '../../../../models';
import { sanitizeSetValue } from '../../../../utils/expression';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const setExpressionAdapter = createMultiAdapter<BaseNode.SetV2.Set, NodeData.SetExpressionV2>(
  ({ expression, variable, type, label }) => ({
    id: Utils.id.cuid.slug(),
    type,
    variable,
    label,
    expression: sanitizeSetValue(expression, type),
  }),
  ({ expression, variable, type, label }) => ({
    type: type as BaseNode.Utils.ExpressionTypeV2.VALUE | BaseNode.Utils.ExpressionTypeV2.ADVANCE,
    variable: variable ?? null,
    label: label ?? null,
    expression: sanitizeSetValue(String(expression), type) ?? '',
  })
);

const setAdapter = createBlockAdapter<BaseNode.SetV2.StepData, NodeData.SetV2>(
  ({ sets, title }) => ({
    sets: setExpressionAdapter.mapFromDB(sets),
    title,
  }),
  ({ sets, title }) => ({
    sets: setExpressionAdapter.mapToDB(sets),
    title,
  })
);

export const setOutPortsAdapter = createOutPortsAdapter<NodeData.SetV2BuiltInPorts, NodeData.SetV2>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const setOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.SetV2BuiltInPorts, NodeData.SetV2>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default setAdapter;
