import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { NodeData } from '../../../../models';
import { sanitizeSetValue } from '../../../../utils/expression';
import { createBlockAdapter } from '../utils';

const setAdapter = createBlockAdapter<Node.SetV2.StepData, NodeData.SetV2>(
  ({ sets, title }) => ({
    title,
    sets: sets.map(({ expression, variable, type }) => ({
      id: Utils.id.cuid.slug(),
      type,
      variable,
      expression: sanitizeSetValue(expression, type),
    })),
  }),
  ({ sets, title }) => ({
    title,
    sets: sets.map(
      ({ expression, variable, type }) =>
        ({
          type,
          variable: variable ?? null,
          expression: sanitizeSetValue(String(expression), type) ?? '',
        } as Node.SetV2.Set)
    ),
  })
);

export default setAdapter;
