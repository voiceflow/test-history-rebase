import { CustomBlock } from '@realtime-sdk/models';
import { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

export const customBlockAdapter = createMultiAdapter<
  Omit<BaseModels.Version.CustomBlock, 'body' | 'paths' | 'stop' | 'defaultPath' | 'parameters'> &
    Partial<Pick<BaseModels.Version.CustomBlock, 'body' | 'paths' | 'stop' | 'defaultPath' | 'parameters'>>,
  CustomBlock
>(
  ({ parameters, key, body = '', stop = false, paths = [], defaultPath = 0, ...rest }) => ({
    ...rest,
    id: key,
    stop,
    body,
    paths,
    parameters: Object.keys(parameters ?? {}),
    defaultPath,
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
