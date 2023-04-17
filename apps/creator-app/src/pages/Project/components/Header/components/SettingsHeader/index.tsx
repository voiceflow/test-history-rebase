import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';

const SettingsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
        <Page.Header.NavLinkSidebarTitle>Settings</Page.Header.NavLinkSidebarTitle>

        <Page.Header.Title leftOffset>
          <Switch>
            <Route path={Path.PROJECT_GENERAL_SETTINGS}>General</Route>
            <Route path={Path.PROJECT_VERSION_SETTINGS}>All Versions</Route>
          </Switch>
        </Page.Header.Title>
      </Page.Header>
    </SharePopperProvider>
  );
};

export default SettingsHeader;
