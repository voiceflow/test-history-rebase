import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';

import { useLogoButtonOptions } from '../../hooks';

const SettingsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
      <Page.Header.NavLinkSidebarTitle>Settings</Page.Header.NavLinkSidebarTitle>

      <Page.Header.Title leftOffset>
        <Switch>
          <Route path={Path.PROJECT_SETTINGS_GENERAL}>General</Route>
          <Route path={Path.PROJECT_SETTINGS_VERSION}>All Versions</Route>
          <Route path={Path.PROJECT_SETTINGS_ENVIRONMENT}>All Environments</Route>
          <Route path={Path.PROJECT_SETTINGS_BACKUP}>Backups</Route>
        </Switch>
      </Page.Header.Title>
    </Page.Header>
  );
};

export default SettingsHeader;
