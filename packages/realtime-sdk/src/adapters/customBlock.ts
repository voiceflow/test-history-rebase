import { CustomBlock } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

export const customBlockAdapter = createMultiAdapter<BaseModels.CustomBlock.Model, CustomBlock>(
  ({ _id, parameters, ...rest }) => ({
    ...rest,
    id: _id,
    parameters: Object.keys(parameters),
  }),
  ({ id, parameters, ...rest }) => ({
    ...rest,
    _id: id,
    parameters: parameters.reduce((acc, cur) => {
      /**
       * The line below is a placeholder. Currently, this line creates a triple redundancy where `cur`
       * is stored as the key of `acc`, in `id`, and in `name`. In a fully-fledged implementation,
       * the `id` would be a unique variable ID and `name` is a user-defined alias for that variable.
       */
      acc[cur] = { id: cur, name: cur };
      return acc;
    }, {} as Record<string, { id: string; name: string }>),
  })
);
