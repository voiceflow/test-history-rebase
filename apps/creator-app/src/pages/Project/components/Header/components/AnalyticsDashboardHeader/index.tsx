import React from 'react';

import Page from '@/components/Page';
import { AnalyticsDashboardContext } from '@/pages/AnalyticsDashboard/context';

import { useLogoButtonOptions } from '../../hooks';

const AnalyticsDashboardHeader: React.FC = () => {
  const logoOptions = useLogoButtonOptions();
  const analyticsDashboard = React.useContext(AnalyticsDashboardContext);

  return (
    <Page.Header renderLogoButton={() => <Page.Header.LogoButton noMargins options={logoOptions} />}>
      <Page.Header.Title leftOffset>Analytics</Page.Header.Title>

      <Page.Header.RightSection rightOffset={false} mr={16}>
        <Page.Header.IconButton icon="refreshData" tooltip={{ content: 'Refresh', offset: [0, -6] }} onClick={() => analyticsDashboard.refresh()} />
      </Page.Header.RightSection>
    </Page.Header>
  );
};

export default AnalyticsDashboardHeader;
