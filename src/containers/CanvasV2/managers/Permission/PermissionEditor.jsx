import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';

import AccountLinking from './components/AccountLinking';
import PermissionPreview from './components/PermissionPreview';
import PermissionSettings from './components/PermissionSettings';

const PermissionRoute = {
  PERMISSIONS: 'permissions',
  ACCOUNT_LINKING: 'account_linking',
};

const ROUTES = [
  {
    label: 'Permissions',
    value: PermissionRoute.PERMISSIONS,
    component: PermissionPreview,
  },
  {
    label: 'Account Linking',
    value: PermissionRoute.ACCOUNT_LINKING,
    component: AccountLinking,
  },
];

function PermissionEditor({ data, onChange }) {
  const toggleSettings = React.useCallback(() => onChange({ settingsOpen: !data.settingsOpen }), [data.settingsOpen, onChange]);
  const updateRoute = React.useCallback((route) => onChange({ accountLinking: route === PermissionRoute.ACCOUNT_LINKING }), [onChange]);

  return (
    <Content>
      <Section>
        {data.settingsOpen ? (
          <PermissionSettings data={data} onChange={onChange} onToggle={toggleSettings} />
        ) : (
          <ButtonGroupRouter
            selected={data.accountLinking ? PermissionRoute.ACCOUNT_LINKING : PermissionRoute.PERMISSIONS}
            routes={ROUTES}
            routeProps={{ data, onChange, toggleSettings }}
            onChange={updateRoute}
          />
        )}
      </Section>
    </Content>
  );
}

export default PermissionEditor;
