import { createAdapter } from './utils';

const intentAdapter = createAdapter(
  ({ key, name, inputs, open, _platform }) => ({
    id: key,
    name,
    inputs,
    open,
    platform: _platform,
  }),
  ({ id, name, inputs, open, platform }) => ({
    key: id,
    name,
    inputs,
    open,
    _platform: platform,
  })
);

export default intentAdapter;
