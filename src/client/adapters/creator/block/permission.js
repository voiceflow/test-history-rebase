import { createBlockAdapter } from './utils';

const permissionBlockAdapter = createBlockAdapter(
  ({ settings, custom, permissions }) => ({
    custom: custom || false,
    permissions,
    settingsOpen: settings,
  }),
  ({ settingsOpen, custom, permissions }) => ({
    custom,
    permissions,
    settings: settingsOpen,
  })
);

export default permissionBlockAdapter;
