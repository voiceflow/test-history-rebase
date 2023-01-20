import { Box, FullSpinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

import BillingHistory from './BillingHistory';
import { useBillingHistory } from './BillingHistory/hooks';
import CancelSubscription from './CancelSubscription';
import EditorSeats from './EditorSeats';
import PaymentDetails from './PaymentDetails';
import ProductionUsage from './ProductionUsage';

const DashboardV2Billing: React.FC = () => {
  const { billingHistory, loading, loadMore } = useBillingHistory();
  const canManageSeats = usePermission(Permission.BILLING_SEATS);
  const hasCard = true;

  const billingHistoryLoading = !billingHistory?.data;

  if (billingHistoryLoading) {
    return <FullSpinner isAbs backgroundColor="#f9f9f9" name="Billing" />;
  }

  return (
    <Box>
      <EditorSeats />
      <ProductionUsage />

      {hasCard && <PaymentDetails />}

      {!!billingHistory?.data.length && <BillingHistory loadMore={loadMore} loading={loading} billingHistory={billingHistory} />}

      {canManageSeats && <CancelSubscription />}
    </Box>
  );
};

export default DashboardV2Billing;
