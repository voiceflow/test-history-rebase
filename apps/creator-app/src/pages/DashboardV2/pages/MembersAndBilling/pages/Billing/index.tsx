import { StripeStatuses } from '@voiceflow/realtime-sdk';
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
import PaymentFailed from './PaymentFailed';

const PAYMENT_FAILED_STRIPE_STATUS = new Set([StripeStatuses.UNPAID, StripeStatuses.PAST_DUE]);

const DashboardV2Billing: React.FC = () => {
  const [canManageSeats] = usePermission(Permission.BILLING_SEATS);
  const isTeamPlan = useSelector(WorkspaceV2.active.isTeamSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const stripeStatus = useSelector(WorkspaceV2.active.stripeStatusSelector);

  const paymentAPI = Payment.usePaymentAPI();
  const billingHistory = useBillingHistory();
  const isReady = billingHistory.isReady && paymentAPI.isReady;

  const showPaymentFailed = PAYMENT_FAILED_STRIPE_STATUS.has(stripeStatus as StripeStatuses) && isTeamPlan && !isTrial;

  if (!isReady) {
    return (
      <Box.FlexCenter fullHeight fullWidth flexGrow={1}>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <Box>
      {showPaymentFailed && <PaymentFailed date={billingHistory?.data[0]?.date} />}

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

      {canManageSeats && isTeamPlan && !isTrial && <CancelSubscription planSubscription={paymentAPI.planSubscription} />}
    </Box>
  );
};

export default withProvider(Payment.PaymentProvider)(DashboardV2Billing);
