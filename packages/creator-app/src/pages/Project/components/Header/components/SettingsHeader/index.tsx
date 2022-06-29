import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header, HeaderLogoButton, HeaderNavLinkSidebarTitle, HeaderTitle } from '@/components/ProjectPage';
import { Path } from '@/config/routes';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';

const SettingsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <HeaderLogoButton options={logoOptions} />}>
        <HeaderNavLinkSidebarTitle>Settings</HeaderNavLinkSidebarTitle>

        <HeaderTitle leftOffset>
          <Switch>
            <Route path={Path.PROJECT_GENERAL_SETTINGS}>General</Route>
            <Route path={Path.PROJECT_VERSION_SETTINGS}>All Versions</Route>
          </Switch>
        </HeaderTitle>
      </Header>
    </SharePopperProvider>
  );
};

export default SettingsHeader;
