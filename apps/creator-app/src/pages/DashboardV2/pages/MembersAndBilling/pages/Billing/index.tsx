import { Box, Spinner, withProvider } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Payment from '@/contexts/PaymentContext';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';

import BillingHistory from './BillingHistory';
import { useBillingHistory } from './BillingHistory/hooks';
import CancelSubscription from './CancelSubscription';
import EditorSeats from './EditorSeats';
import PaymentDetails from './PaymentDetails';

const DashboardV2Billing: React.FC = () => {
  const [canManageSeats] = usePermission(Permission.BILLING_SEATS);
  const isTeamPlan = useSelector(WorkspaceV2.active.isTeamSelector);

  const paymentAPI = Payment.usePaymentAPI();
  const billingHistory = useBillingHistory();
  const isReady = billingHistory.isReady && paymentAPI.isReady;

  if (!isReady) {
    return (
      <Box.FlexCenter fullHeight fullWidth flexGrow={1}>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <Box>
      <EditorSeats />

      {paymentAPI.paymentSource && <PaymentDetails source={paymentAPI.paymentSource} refetch={paymentAPI.refetchPaymentSource} />}

      {!!billingHistory?.data?.length && (
        <BillingHistory
          data={billingHistory.data}
          status={billingHistory.status}
          hasMore={!!billingHistory.hasMore}
          loadMore={billingHistory.loadMore}
        />
      )}

      {canManageSeats && isTeamPlan && <CancelSubscription />}
    </Box>
  );
};

export default withProvider(Payment.PaymentProvider)(DashboardV2Billing);
