import { createBlockAdapter } from './utils';

const permissionBlockAdapter = createBlockAdapter(
  ({ settings, custom, permissions, a_l }) => ({
    custom: custom || false,
    permissions,
    settingsOpen: settings,
    accountLinking: !!a_l,
  }),
  ({ settingsOpen, custom, permissions, accountLinking }) => ({
    custom,
    permissions,
    settings: settingsOpen,
    a_l: !!accountLinking,
  })
);

export default permissionBlockAdapter;
