import { Box, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as Workspace from '@/components/Workspace';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as currency from '@/utils/currency';
import * as date from '@/utils/date';

import CardDetails from './CardDetails';

interface BillingEditorSeatsProps {
  nextBillingDate: string | null;
  planAmount: number;
  billingPeriod: string | null;
}

const BillingEditorSeats: React.FC<BillingEditorSeatsProps> = ({ nextBillingDate, planAmount, billingPeriod }) => {
  const seats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const trialEndAt = useSelector(WorkspaceV2.active.organizationTrialEndAtSelector);
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.members.usedViewerSeatsSelector);
  const creditCard = useSelector(Organization.creditCardSelector);

  const amount = isPaidPlan ? planAmount ?? 0 : 0;
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
                    This organization has <Text color="#132144">{seats} Editor seats.</Text>
                  </div>
                )}

                {isEnterprise && 'Want to make changes to your next billing cycle? Contact sales@voiceflow.com.'}

                {showBillingDateDescription && (
                  <>
                    Your next billing date is <Text color="#132144">{nextBillingDate}.</Text>{' '}
                  </>
                )}
              </Page.Section.Description>
            </div>
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
                <SectionV2.Description>
                  {currency.formatUSD(amount, { noDecimal: true, unit: 'cent' })}{' '}
                </SectionV2.Description>
                <SectionV2.Description secondary> per Editor, per {billingPeriod}</SectionV2.Description>
              </div>
            ) : (
              <Workspace.TakenSeatsMessage small label="Editor seats taken." />
            )}
          </Box.FlexAlignStart>

          {creditCard && <CardDetails last4={creditCard.last4} brand={creditCard.brand} />}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{isEnterprise ? 100 : seats} Editor seats</SectionV2.Description>
        <SectionV2.Description>
          {isEnterprise ? 'Custom' : currency.formatUSD(amount, { unit: 'cent' })}
        </SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      {usedViewerSeats > 0 && (
        <>
          <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
            <SectionV2.Description>{usedViewerSeats} Viewer seats</SectionV2.Description>
            <SectionV2.Description>Free</SectionV2.Description>
          </SectionV2.SimpleSection>

          <SectionV2.Divider inset />
        </>
      )}

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 3.5 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Title bold>Total</SectionV2.Title>
          <SectionV2.Title bold fill={false}>
            {isEnterprise ? 'Custom' : currency.formatUSD(amount, { unit: 'cent' })}
          </SectionV2.Title>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default BillingEditorSeats;
