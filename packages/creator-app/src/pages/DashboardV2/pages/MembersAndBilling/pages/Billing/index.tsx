import { Box } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';

import { BillingHistory, CancelSubscription, EditorSeats, PaymentDetails, ProductionUsage } from './components';

const DashboardV2Billing: React.OldFC = () => {
  const canManageSeats = usePermission(Permission.BILLING_SEATS);
  const hasCard = true;
  const hasBillingHistory = true;

  return (
    <Box>
      <EditorSeats />
      <ProductionUsage />

      {hasCard && <PaymentDetails />}

      {hasBillingHistory && <BillingHistory />}

      {canManageSeats && <CancelSubscription />}
    </Box>
  );
};

export default DashboardV2Billing;
