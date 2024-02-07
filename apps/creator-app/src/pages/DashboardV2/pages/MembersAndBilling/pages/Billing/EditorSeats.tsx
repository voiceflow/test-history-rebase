import { Box, Button, Link, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as Workspace from '@/components/Workspace';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import * as currency from '@/utils/currency';
import * as date from '@/utils/date';

// import CardDetails from './CardDetails';

interface BillingEditorSeatsProps {
  nextBillingDate: string | null;
  pricePerEditor: number;
  billingPeriod: string | null;
  editorSeats: number;
}

const BillingEditorSeats: React.FC<BillingEditorSeatsProps> = ({ nextBillingDate, pricePerEditor, billingPeriod, editorSeats }) => {
  // const { refetchPlanSubscription } = Payment.usePaymentAPI();
  const scheduleSeatModal = ModalsV2.useModal(ModalsV2.Billing.ScheduleSeatChange);
  const seats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const trialEndAt = useSelector(WorkspaceV2.active.organizationTrialEndAtSelector);
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const [canScheduleSeats] = usePermission(Permission.BILLING_SEATS_SCHEDULE);

  // FIXME: Billing api doesnt return this information yet. https://voiceflow.atlassian.net/browse/CV3-986
  const scheduledSeat = editorSeats !== seats;

  const openScheduleSeatModal = async () => {
    await scheduleSeatModal.openVoid({
      nextBillingDate,
      pricePerEditor,
      billingPeriod,
      scheduleOrCurrentEditorSeats: scheduledSeat ? editorSeats : seats,
    });
  };

  const unitPrice = isPaidPlan ? pricePerEditor ?? 0 : 0;
  const showProTrialDescription = !isEnterprise && isTrial;
  const showBillingDateDescription = isPaidPlan && !isEnterprise && !isTrial;

  return (
    <Page.Section
      mb={24}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <div>
              <Page.Section.Title>Payment Overview</Page.Section.Title>

              <Page.Section.Description>
                {showProTrialDescription && trialEndAt && (
                  <div>
                    Your free trial ends on <Text color="#132144">{date.toDD_MMM_YYYY(trialEndAt)}.</Text>
                  </div>
                )}
                {!isPaidPlan && !isTrial && (
                  <div>
                    This workspace has <Text color="#132144">{seats} Editor seats.</Text>
                  </div>
                )}

                {isEnterprise && `Want to make changes to your next billing cycle? Contact sales@voiceflow.com.`}

                {showBillingDateDescription && (
                  <>
                    Your next billing date is <Text color="#132144">{nextBillingDate}.</Text>{' '}
                    {scheduledSeat && <Link onClick={openScheduleSeatModal}>Seat changes are scheduled</Link>}
                  </>
                )}
              </Page.Section.Description>
            </div>

            {canScheduleSeats && !isTrial && (
              <Button variant={Button.Variant.SECONDARY} onClick={openScheduleSeatModal}>
                Schedule Seat Change
              </Button>
            )}
          </Box.FlexApart>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection headerProps={{ bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart column gap={4}>
            <SectionV2.Title bold>Editor Seats</SectionV2.Title>

            {isPaidPlan && !isEnterprise ? (
              <div>
                <SectionV2.Description>{currency.formatUSD(unitPrice, { noDecimal: true })} </SectionV2.Description>
                <SectionV2.Description secondary> per Editor, per {billingPeriod}</SectionV2.Description>
              </div>
            ) : (
              <Workspace.TakenSeatsMessage small label="Editor seats taken." />
            )}
          </Box.FlexAlignStart>

          {/*
          FIXME: Add payment source
          {paymentSource && <CardDetails last4={paymentSource.last4} brand={paymentSource.brand} />} */}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{isEnterprise ? 100 : seats} Editor seats</SectionV2.Description>
        <SectionV2.Description>{isEnterprise ? 'Custom' : currency.formatUSD(unitPrice * seats)}</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{usedViewerSeats} Viewer seats</SectionV2.Description>
        <SectionV2.Description>Free</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 3.5 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Title bold>Total</SectionV2.Title>
          <SectionV2.Title bold fill={false}>
            {isEnterprise ? 'Custom' : currency.formatUSD(unitPrice * seats)}
          </SectionV2.Title>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default BillingEditorSeats;
