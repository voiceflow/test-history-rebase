import type { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { CustomBlock } from '@/models';

export const customBlockAdapter = createMultiAdapter<BaseModels.Version.CustomBlock, CustomBlock>(
  ({ parameters, key, ...rest }) => ({
    ...rest,
    id: key,
    parameters: Object.keys(parameters),
  }),
  ({ parameters, id, ...rest }) => ({
    ...rest,
    key: id,
    parameters: parameters.reduce(
      (acc, cur) => {
        /**
         * The line below is a placeholder. Currently, this line creates a triple redundancy where `cur`
         * is stored as the key of `acc`, in `id`, and in `name`. In a fully-fledged implementation,
         * the `id` would be a unique variable ID and `name` is a user-defined alias for that variable.
         */
        acc[cur] = { id: cur, name: cur };
        return acc;
      },
      {} as Record<string, { id: string; name: string }>
    ),
  })
);
