import { Box, Spinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

import BillingHistory from './BillingHistory';
import { useBillingHistory } from './BillingHistory/hooks';
import CancelSubscription from './CancelSubscription';
import EditorSeats from './EditorSeats';
import PaymentDetails from './PaymentDetails';
import ProductionUsage from './ProductionUsage';
import { useUsageSubscription } from './ProductionUsage/hooks';

const DashboardV2Billing: React.FC = () => {
  const billingHistory = useBillingHistory();
  const usageSubscription = useUsageSubscription();
  const canManageSeats = usePermission(Permission.BILLING_SEATS);
  const hasCard = true;

  const isReady = billingHistory.isReady && usageSubscription.isReady;

  if (!isReady) {
    return (
      <Box.FlexCenter fullHeight fullWidth>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <Box>
      <EditorSeats />
      {usageSubscription.data?.billingStartDate && <ProductionUsage data={usageSubscription.data} />}

      {hasCard && <PaymentDetails />}

      {!!billingHistory?.data?.length && (
        <BillingHistory
          loadMore={billingHistory.loadMore}
          status={billingHistory.status}
          data={billingHistory.data}
          hasMore={!!billingHistory.hasMore}
        />
      )}

      {canManageSeats && <CancelSubscription />}
    </Box>
  );
};

export default DashboardV2Billing;
