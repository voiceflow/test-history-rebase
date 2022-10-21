import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Header, HeaderLogoButton, HeaderNavLinkSidebarTitle, HeaderTitle } from '@/components/ProjectPage';
import { Path } from '@/config/routes';

import { SharePopperProvider } from '../contexts';
import { useLogoButtonOptions } from '../hooks';

const IntegrationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <HeaderLogoButton options={logoOptions} />}>
        <HeaderNavLinkSidebarTitle>Integrations</HeaderNavLinkSidebarTitle>

        <HeaderTitle leftOffset>
          <Switch>
            <Route path={Path.PUBLISH_WEBCHAT}>Web Chat</Route>
            <Route path={Path.PUBLISH_EXPORT}>Code Export</Route>
            <Route path={Path.PUBLISH_ALEXA}>Amazon Alexa</Route>
            <Route path={Path.PUBLISH_GOOGLE}>Google Assistant</Route>
            <Route path={Path.PUBLISH_API}>API</Route>
          </Switch>
        </HeaderTitle>
      </Header>
    </SharePopperProvider>
  );
};

export default IntegrationsHeader;
