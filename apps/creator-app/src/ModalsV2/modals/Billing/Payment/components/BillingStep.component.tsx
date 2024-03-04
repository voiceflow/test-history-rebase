import { BillingPeriod } from '@voiceflow/internal';
import { Alert, Box, Button, Modal, SectionV2, Text } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import * as Workspace from '@/components/Workspace';
import * as currency from '@/utils/currency';

import { usePaymentSteps, usePricing, useSeats } from '../hooks';

interface BillingStepProps {
  isLoading: boolean;
}

export const BillingStep: React.FC<BillingStepProps> = ({ isLoading }) => {
  const { downgradedSeats, editorPlanSeatLimits, usedEditorSeats, viewerSeats, selectedEditorSeats } = useSeats();
  const { onBack, onNext } = usePaymentSteps();
  const { price, periodPrice, prices, period, hasCard, onChangePeriod } = usePricing();

  return (
    <>
      <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
        <Box.Flex gap={16} column fullWidth>
          {selectedEditorSeats < usedEditorSeats && (
            <Alert title={<Alert.Title>Your workspace currently has {usedEditorSeats} Editors</Alert.Title>}>
              You&apos;re about to remove {downgradedSeats} Editor {pluralize('seat', selectedEditorSeats)}, but there are {usedEditorSeats} in use.
              On removal, we&apos;ll automatically downgrade {downgradedSeats} {pluralize('Editor', downgradedSeats)} to{' '}
              {pluralize('Viewer', downgradedSeats)}.
            </Alert>
          )}

          <RadioGroup
            column
            options={[
              {
                id: BillingPeriod.ANNUALLY,
                label: (
                  <>
                    Paid annually{' '}
                    <Text color="#62778C">
                      - {currency.formatUSD(prices?.[BillingPeriod.ANNUALLY] ?? 0, { noDecimal: true })} per Editor/m, paid annually
                    </Text>
                  </>
                ),
              },
              {
                id: BillingPeriod.MONTHLY,
                label: (
                  <>
                    Paid monthly{' '}
                    <Text color="#62778C">
                      - {currency.formatUSD(prices?.[BillingPeriod.MONTHLY] ?? 0, { noDecimal: true })} per Editor/m, paid monthly
                    </Text>
                  </>
                ),
              },
            ]}
            checked={period}
            onChange={onChangePeriod}
            activeBar
            noPaddingLastItem={false}
          />
        </Box.Flex>
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart gap={4} column>
            <SectionV2.Title bold>Summary</SectionV2.Title>

            <div>
              {selectedEditorSeats > editorPlanSeatLimits ? (
                <Workspace.TakenSeatsMessage seats={editorPlanSeatLimits} error small />
              ) : (
                <SectionV2.Description>
                  {currency.formatUSD(periodPrice, { noDecimal: true })}
                  <Text color="#62778C" paddingLeft="3px">
                    per Editor, per {period === BillingPeriod.ANNUALLY ? 'year' : 'month'}
                  </Text>
                </SectionV2.Description>
              )}
            </div>
          </Box.FlexAlignStart>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Description>
            {selectedEditorSeats} Editor {pluralize('seats', selectedEditorSeats)}
          </SectionV2.Description>

          <SectionV2.Description>{currency.formatUSD(price)}</SectionV2.Description>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Description>
            {viewerSeats} Viewer {pluralize('seats', viewerSeats)}
          </SectionV2.Description>

          <SectionV2.Description>Free</SectionV2.Description>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 3.25 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Title bold>Total</SectionV2.Title>

          <SectionV2.Title fill={false} bold>
            {currency.formatUSD(price, { noDecimal: true })}
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
          disabled={isLoading || selectedEditorSeats > editorPlanSeatLimits}
          isLoading={isLoading}
          squareRadius
        >
          {hasCard ? 'Confirm & Pay' : 'Continue to Payment'}
        </Button>
      </Modal.Footer>
    </>
  );
};
