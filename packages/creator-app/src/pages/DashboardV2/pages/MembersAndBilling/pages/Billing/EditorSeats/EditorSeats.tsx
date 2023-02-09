import { Box, Button, Link, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import Workspace from '@/components/Workspace';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { DBPaymentSource, PlanSubscription } from '@/models';
import * as currency from '@/utils/currency';

import CardDetails from '../CardDetails';

interface EditorSeatsProps {
  data: PlanSubscription;
  source: DBPaymentSource | null;
  refetch: () => Promise<void>;
}

const EditorSeats: React.FC<EditorSeatsProps> = ({ data, source, refetch }) => {
  const scheduleSeatModal = ModalsV2.useModal(ModalsV2.Billing.ScheduleSeatChange);
  const seats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const canManageSeats = usePermission(Permission.BILLING_SEATS);

  const { nextBillingDate, unitPrice, interval, quantity } = data;
  const scheduledSeat = quantity !== seats;

  const openScheduleSeatModal = async () => {
    await scheduleSeatModal.openVoid({
      nextBillingDate,
      pricePerEditor: unitPrice,
      priceInterval: interval,
      scheduleOrCurrentEditorSeats: scheduledSeat ? quantity : seats,
    });
    refetch();
  };

  return (
    <Page.Section
      mb={24}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <div>
              <Page.Section.Title>Payment Overview</Page.Section.Title>

              <Page.Section.Description>
                {!isPaidPlan && (
                  <div>
                    This workspace has <Text color="#132144">{seats} Editor seats.</Text>
                  </div>
                )}

                {isEnterprise && `Want to make changes to your next billing cycle? Contact sales@voiceflow.com.`}

                {isPaidPlan && !isEnterprise && (
                  <>
                    Your next billing date is <Text color="#132144">{nextBillingDate}.</Text>{' '}
                    {scheduledSeat && <Link onClick={openScheduleSeatModal}>Seat changes are scheduled</Link>}
                  </>
                )}
              </Page.Section.Description>
            </div>

            {canManageSeats && (
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

            {!isPaidPlan && <Workspace.TakenSeatsMessageV2 small />}

            {isEnterprise && (
              <div>
                <SectionV2.Description>{seats} </SectionV2.Description>
                <SectionV2.Description secondary> Editor seat{seats > 1 && 's'} being used in this workspace.</SectionV2.Description>
              </div>
            )}

            {isPaidPlan && !isEnterprise && (
              <div>
                <SectionV2.Description>{currency.formatUSD(unitPrice, { noDecimal: true })} </SectionV2.Description>
                <SectionV2.Description secondary> per Editor, per {interval}</SectionV2.Description>
              </div>
            )}
          </Box.FlexAlignStart>

          {source && <CardDetails>{source.last4}</CardDetails>}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{seats} Editor seats</SectionV2.Description>
        <SectionV2.Description>{currency.formatUSD(unitPrice * seats)}</SectionV2.Description>
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
            {currency.formatUSD(unitPrice * seats)}
          </SectionV2.Title>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default EditorSeats;
