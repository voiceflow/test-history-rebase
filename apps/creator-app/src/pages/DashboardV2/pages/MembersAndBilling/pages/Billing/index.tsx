// import { StripeStatuses } from '@voiceflow/realtime-sdk';
import { Box, Spinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
// import PaymentDetails from './PaymentDetails';
// import PaymentFailed from './PaymentFailed';
import { usePermission, useSelector } from '@/hooks';

// import { Permission } from '@/constants/permissions';
// import * as WorkspaceV2 from '@/ducks/workspaceV2';
// import { usePermission, useSelector } from '@/hooks';
import BillingHistory from './BillingHistory/BillingHistory.component';
import { useBillingHistory } from './BillingHistory/hooks';
import CancelSubscription from './CancelSubscription';
import EditorSeats from './EditorSeats';
import { useScheduledSubscription } from './hooks/useScheduledSubscription';

// const PAYMENT_FAILED_STRIPE_STATUS = new Set([StripeStatuses.UNPAID, StripeStatuses.PAST_DUE]);

const DashboardV2Billing: React.FC = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const subscription = useSelector(Organization.active.chargebeeSubscriptionSelector)!;

  const [canManageSeats] = usePermission(Permission.BILLING_SEATS);
  const isProOrTeamPlan = useSelector(WorkspaceV2.active.isProOrTeamSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  // const stripeStatus = useSelector(WorkspaceV2.active.stripeStatusSelector);

  const scheduledSubscription = useScheduledSubscription();
  const billingHistory = useBillingHistory();
  const isReady = billingHistory.isReady && organizationID && subscription && scheduledSubscription.isReady;

  // const showPaymentFailed = PAYMENT_FAILED_STRIPE_STATUS.has(stripeStatus as StripeStatuses) && isProOrTeamPlan && !isTrial;

  if (!isReady) {
    return (
      <Box.FlexCenter fullHeight fullWidth flexGrow={1}>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <Box>
      {/* {showPaymentFailed && <PaymentFailed date={billingHistory?.data[0]?.date} />} */}

      <EditorSeats
        nextBillingDate={subscription.nextBillingDate ?? null}
        pricePerEditor={subscription.pricePerEditor}
        billingPeriod={subscription.billingPeriodUnit ?? null}
        scheduledEditorSeats={scheduledSubscription.data?.editorSeats}
      />

      {/* {paymentAPI.paymentSource && <PaymentDetails source={paymentAPI.paymentSource} refetch={paymentAPI.refetchPaymentSource} />} */}

      {!!billingHistory?.data?.length && (
        <BillingHistory
          organizationID={organizationID}
          data={billingHistory.data}
          status={billingHistory.status}
          hasMore={!!billingHistory.hasMore}
          loadMore={billingHistory.loadMore}
        />
      )}

      {canManageSeats && isProOrTeamPlan && !isTrial && (
        <CancelSubscription nextBillingDate={subscription.nextBillingDate ?? null} subscriptionStatus={subscription.status} />
      )}
    </Box>
  );
};

export default DashboardV2Billing;
