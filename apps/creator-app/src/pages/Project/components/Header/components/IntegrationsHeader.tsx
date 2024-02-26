import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page from '@/components/Page';
import { Path } from '@/config/routes';

import { useLogoButtonOptions } from '../hooks';

const IntegrationsHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
      <Page.Header.NavLinkSidebarTitle>Integrations</Page.Header.NavLinkSidebarTitle>

      <Page.Header.Title leftOffset>
        <Switch>
          <Route path={Path.PUBLISH_WEBCHAT}>Web Chat</Route>
          <Route path={Path.PUBLISH_EXPORT}>Code Export</Route>
          <Route path={Path.PUBLISH_SMS}>Twilio SMS</Route>
          <Route path={Path.PROTOTYPE_SMS}>SMS Testing</Route>
          <Route path={Path.PUBLISH_WHATSAPP}>WhatsApp</Route>
          <Route path={Path.PROTOTYPE_WHATSAPP}>WhatsApp Testing</Route>
          <Route path={Path.PUBLISH_TEAMS}>Microsoft Teams</Route>
          <Route path={Path.PUBLISH_API}>API</Route>
          <Route path={Path.PUBLISH_KNOWLEDGE_BASE_API}>Knowledge Base API</Route>
        </Switch>
      </Page.Header.Title>
    </Page.Header>
  );
};

export default IntegrationsHeader;
