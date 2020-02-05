import { createBlockAdapter } from './utils';

const permissionBlockAdapter = createBlockAdapter(
  ({ settings, permissions, a_l }) => ({
    permissions,
    settingsOpen: settings,
    accountLinking: !!a_l,
  }),
  ({ settingsOpen, permissions, accountLinking }) => ({
    custom: permissions.length !== 0,
    permissions,
    settings: settingsOpen,
    a_l: !!accountLinking,
  })
);

export default permissionBlockAdapter;
