import { Button, ButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { AnalyticsDashboardContext } from '@/pages/AnalyticsDashboard/context';

import { SharePopperProvider } from '../../contexts';
import { useLogoButtonOptions } from '../../hooks';

const AnalyticsDashboardHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);

  // TODO(jonahsnider): Check with Mike if we need to add any kind of loading state to the refresh button
  // Spin animation? Disable button? Toast? etc

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <Page.Header.LogoButton options={logoOptions} />}>
        <Page.Header.Title>Analytics</Page.Header.Title>

        <Page.Header.RightSection>
          <Page.Header.IconButton
            icon="refreshData"
            tooltip={{ content: <TippyTooltip.Title>'Refresh'</TippyTooltip.Title> }}
            onClick={() => analyticsDashboard.refresh()}
          />

          <Button variant={ButtonVariant.PRIMARY}>Share</Button>
        </Page.Header.RightSection>
      </Page.Header>
    </SharePopperProvider>
  );
};

export default AnalyticsDashboardHeader;
