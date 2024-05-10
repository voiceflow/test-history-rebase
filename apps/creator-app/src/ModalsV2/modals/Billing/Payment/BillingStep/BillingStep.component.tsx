import { BillingPeriodUnit } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Box, Button, Modal, SectionV2, Text } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import * as Organization from '@/ducks/organization';
import * as Workspace from '@/ducks/workspaceV2';
import { useFeature, useSelector } from '@/hooks';
import * as currency from '@/utils/currency';

import { usePaymentSteps, usePricing } from '../hooks';

interface BillingStepProps {
  isLoading: boolean;
}

export const BillingStep: React.FC<BillingStepProps> = ({ isLoading }) => {
  const { isEnabled: teamsPlanSelfServeIsEnabled } = useFeature(FeatureFlag.TEAMS_PLAN_SELF_SERVE);
  const usedViewerSeats = useSelector(Workspace.active.usedViewerSeatsSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
  const { onBack, onNext } = usePaymentSteps();
  const { selectedPlan, selectedPeriod, selectedPlanPrice, hasCard, onChangePeriod } = usePricing();

  const amount = selectedPlanPrice?.amount ?? 0;
  const planSeats = selectedPlan?.seats ?? 1;
  const pricesByPeriodUnit = selectedPlan?.pricesByPeriodUnit ?? {};

  const getRadioOptionLabel = (id: 'month' | 'year', unit: string) => {
    return (
      <>
        Paid {unit}{' '}
        <Text color="#62778C">
          - {currency.formatUSD(pricesByPeriodUnit?.[id]?.monthlyAmount ?? 0, { noDecimal: true, unit: 'cent' })}{' '}
          {teamsPlanSelfServeIsEnabled ? '/m' : 'per Editor/m'}, paid {unit}
        </Text>
      </>
    );
  };

  const periods = [
    { id: BillingPeriodUnit.YEAR, label: getRadioOptionLabel(BillingPeriodUnit.YEAR, 'annually') },
    ...(subscription?.billingPeriodUnit !== BillingPeriodUnit.YEAR
      ? [{ id: BillingPeriodUnit.MONTH, label: getRadioOptionLabel(BillingPeriodUnit.MONTH, 'monthly') }]
      : []),
  ];

  return (
    <>
      <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
        <Box.Flex gap={16} column fullWidth>
          <RadioGroup column options={periods} checked={selectedPeriod} onChange={onChangePeriod} activeBar noPaddingLastItem={false} />
        </Box.Flex>
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart gap={4} column fullWidth>
            <SectionV2.Title bold>Summary</SectionV2.Title>

            {teamsPlanSelfServeIsEnabled ? (
              <Box.FlexApart fullWidth>
                <SectionV2.Description>
                  <Text color="#62778C" paddingLeft="3px">
                    {planSeats} Editor {pluralize('seats', planSeats)}, paid {selectedPeriod === BillingPeriodUnit.YEAR ? 'annually' : 'monthly'}
                  </Text>{' '}
                </SectionV2.Description>
                <SectionV2.Description>{currency.formatUSD(amount, { unit: 'cent' })}</SectionV2.Description>
              </Box.FlexApart>
            ) : (
              <div>
                <SectionV2.Description>
                  {currency.formatUSD(amount, { noDecimal: true, unit: 'cent' })}
                  <Text color="#62778C" paddingLeft="3px">
                    per Editor, per {selectedPeriod === BillingPeriodUnit.YEAR ? 'year' : 'month'}
                  </Text>
                </SectionV2.Description>
              </div>
            )}
          </Box.FlexAlignStart>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      {!teamsPlanSelfServeIsEnabled && (
        <>
          <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
            <Box.FlexApart fullWidth>
              <SectionV2.Description>
                {planSeats} Editor {pluralize('seats', planSeats)}
              </SectionV2.Description>

              <SectionV2.Description>{currency.formatUSD(amount, { unit: 'cent' })}</SectionV2.Description>
            </Box.FlexApart>
          </SectionV2.SimpleSection>

          <SectionV2.Divider inset />
        </>
      )}

      {usedViewerSeats > 0 && (
        <>
          <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
            <Box.FlexApart fullWidth>
              <SectionV2.Description>
                {usedViewerSeats} Viewer {pluralize('seats', usedViewerSeats)}
              </SectionV2.Description>

              <SectionV2.Description>Free</SectionV2.Description>
            </Box.FlexApart>
          </SectionV2.SimpleSection>

          <SectionV2.Divider inset />
        </>
      )}

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 3.25 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Title bold>Total</SectionV2.Title>

          <SectionV2.Title fill={false} bold>
            {currency.formatUSD(amount, { noDecimal: true, unit: 'cent' })}
          </SectionV2.Title>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <Modal.Footer gap={12}>
        <Button onClick={onBack} variant={Button.Variant.TERTIARY} squareRadius>
          Back
        </Button>

        <Button
          width={hasCard ? 144 : 194}
          onClick={() => onNext()}
          variant={Button.Variant.PRIMARY}
          disabled={isLoading}
          isLoading={isLoading}
          squareRadius
        >
          {hasCard ? 'Confirm & Pay' : 'Continue to Payment'}
        </Button>
      </Modal.Footer>
    </>
  );
};
