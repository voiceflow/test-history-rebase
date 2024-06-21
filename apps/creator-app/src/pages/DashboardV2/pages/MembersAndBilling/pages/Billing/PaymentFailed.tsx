import { Box } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import Alert from '@/components/legacy/Alert';
import Page from '@/components/Page';

interface PaymentFailedProps {
  date: string | null;
}

export const FORMAT = 'DD MMM YYYY';

const PaymentFailed: React.FC<PaymentFailedProps> = ({ date }) => {
  const deadlineDate = dayjs(date).add(1, 'week');

  return (
    <Page.Section
      mb={0}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <Alert title={<Alert.Title>Payment Failed</Alert.Title>} variant={Alert.Variant.DANGER}>
              It looks like there was an issue with your payment method. Please update your card information by{' '}
              {deadlineDate.format(FORMAT)} to continue using Pro features.
            </Alert>
          </Box.FlexApart>
        </Page.Section.Header>
      }
    />
  );
};

export default PaymentFailed;
