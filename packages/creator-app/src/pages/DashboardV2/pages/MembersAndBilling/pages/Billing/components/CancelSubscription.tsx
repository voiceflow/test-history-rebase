import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';

const CancelSubscription: React.FC = () => {
  return (
    <Page.Section
      mb={0}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <div>
              <Page.Section.Title>Cancel Subscription</Page.Section.Title>
              <Page.Section.Description>Pro features will be available until the end of the current billing cycle.</Page.Section.Description>
            </div>

            <Button variant={Button.Variant.SECONDARY}>Cancel Subscription</Button>
          </Box.FlexApart>
        </Page.Section.Header>
      }
    />
  );
};

export default CancelSubscription;
