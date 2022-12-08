import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';

const AnalyticsDashboardHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
        <Page.Header.Title>Analytics</Page.Header.Title>

        <Page.Header.RightSection>
          <Page.Header.IconButton icon="refreshData" isSmall tooltip={{ title: 'Refresh' }} />

          <Button variant={ButtonVariant.PRIMARY}>Share</Button>
        </Page.Header.RightSection>
      </Page.Header>
    </SharePopperProvider>
  );
};

export default AnalyticsDashboardHeader;
