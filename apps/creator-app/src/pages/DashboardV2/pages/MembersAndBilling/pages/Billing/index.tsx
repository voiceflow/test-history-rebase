// import { StripeStatuses } from '@voiceflow/realtime-sdk';
import { Box, Spinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';

import BillingHistory from './BillingHistory/BillingHistory.component';
import { useBillingHistory } from './BillingHistory/hooks';
import CancelSubscription from './CancelSubscription';
import EditorSeats from './EditorSeats';
import PaymentDetails from './PaymentDetails';
import PaymentFailed from './PaymentFailed';

const DashboardV2Billing: React.FC = () => {
  const organizationID = useSelector(WorkspaceV2.active.organizationIDSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const [canManageSeats] = usePermission(Permission.FEATURE_MANAGE_SEATS);
  const isProOrTeamPlan = useSelector(WorkspaceV2.active.isProOrTeamSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const paymentMethod = useSelector(Organization.paymentMethodSelector);

  const billingHistory = useBillingHistory();
  const isReady = billingHistory.isReady && organizationID && subscription;
  const showPaymentFailed = !isTrial && (paymentMethod?.failed || subscription?.onDunningPeriod);

  if (!isReady) {
    return (
      <Box.FlexCenter fullHeight fullWidth flexGrow={1}>
        <Spinner borderLess fillContainer />
      </Box.FlexCenter>
    );
  }

  return (
    <Box>
      {showPaymentFailed && <PaymentFailed date={billingHistory?.data[0]?.date ?? null} />}

      <EditorSeats
        nextBillingDate={subscription.nextBillingDate ?? null}
        planAmount={subscription.planAmount}
        billingPeriod={subscription.billingPeriodUnit ?? null}
      />

      {paymentMethod && <PaymentDetails paymentMethod={paymentMethod} />}

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
        <CancelSubscription
          nextBillingDate={subscription.nextBillingDate ?? null}
          subscriptionStatus={subscription.status}
          plan={subscription.plan}
        />
      )}
    </Box>
  );
};

export default DashboardV2Billing;
