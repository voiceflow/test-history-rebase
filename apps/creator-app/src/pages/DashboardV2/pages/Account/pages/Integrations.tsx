import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

import { AmazonIntegration } from '../components';

const Integrations: React.FC = () => {
  return (
    <Page.Section
      header={
        <Page.Section.Header>
          <Page.Section.Title>Account Integrations</Page.Section.Title>
        </Page.Section.Header>
      }
    >
      <SectionV2.Divider />

      <AmazonIntegration />
    </Page.Section>
  );
};

export default Integrations;
