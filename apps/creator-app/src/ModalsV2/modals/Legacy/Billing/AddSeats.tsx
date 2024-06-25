import { BillingPeriod } from '@voiceflow/internal';
import { Alert, Button, Modal, SectionV2, Spinner, System, Text, toast, withProvider } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import * as Workspace from '@/components/Workspace';
import * as Payment from '@/contexts/PaymentContext';
import { UpgradePrompt } from '@/ducks/tracking/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useTrackingEvents } from '@/hooks/';
import { useSelector } from '@/hooks/redux';
import * as currency from '@/utils/currency';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import manager from '../../../manager';
import SeatsInput from '../../Billing/SeatsInput';

const AddSeats = manager.create('LegacyBillingAddSeats', () =>
  // eslint-disable-next-line sonarjs/cognitive-complexity
  withProvider(Payment.legacy.PaymentProvider)(({ api, type, opened, hidden, animated, closePrevented }) => {
    const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
    const isOnProTrial = useSelector(WorkspaceV2.active.isOnProTrialSelector);
    const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
    const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);

    const paymentAPI = Payment.legacy.usePaymentAPI();
    const [trackingEvents] = useTrackingEvents();

    const { unitPrice, billingPeriod } = Workspace.useSubscriptionInfo();
    const { nextBillingDate = null } = paymentAPI.planSubscription ?? {};

    const [numSeats, setNumSeats] = React.useState(numberOfSeats);

    const isAnnual = billingPeriod === BillingPeriod.ANNUALLY;

    const pricePerEditor = !isPaidPlan ? 0 : unitPrice ?? 0;
    const totalPriceForEditors = isOnProTrial ? 0 : numSeats * pricePerEditor;

    const isReducing = numSeats < numberOfSeats;
    const isIncreasing = numSeats > numberOfSeats;
    const shouldProrate = isAnnual && isIncreasing;

    const onAddSeats = async () => {
      api.preventClose();

      try {
        await paymentAPI.updatePlanSubscriptionSeats(numSeats);

        trackingEvents.trackSeatChange({ reduced: isReducing, scheduled: false });

        api.enableClose();
        api.close();
      } catch {
        api.enableClose();
        toast.error('Failed to update seats. Please try again later.');
      }
    };

    const onContactSales = () => {
      trackingEvents.trackContactSales({ promptType: UpgradePrompt.EDITOR_SEATS });

      onOpenBookDemoPage();
    };

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Add Editor Seats</Modal.Header>

        {!paymentAPI.isReady ? (
          <Spinner borderLess />
        ) : (
          <>
            <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
              <SectionV2.Description secondary lineHeight="20px">
                {isPaidPlan || isOnProTrial ? (
                  <>
                    Your workspace currently has {numberOfSeats} Editor {pluralize('seat', numberOfSeats)}. Seats you
                    add here are available immediately and are billed on a pro-rata basis until the next billing date on{' '}
                    {nextBillingDate}.
                  </>
                ) : (
                  <>
                    Free Workspaces can add up to {editorPlanSeatLimits} editors. If you need more,{' '}
                    <System.Link.Button onClick={onContactSales}>contact our sales team</System.Link.Button>
                  </>
                )}
              </SectionV2.Description>
            </SectionV2.SimpleSection>

            {isReducing && (
              <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2.5 }}>
                <Alert title={<Alert.Title>You're reducing the number of Editor seats</Alert.Title>}>
                  If you are using more than {numSeats} Editor seats on your next billing date, we will downgrade{' '}
                  {numberOfSeats - numSeats} Editor to Viewer.
                </Alert>
              </SectionV2.SimpleSection>
            )}

            <SectionV2.Divider />

            <Workspace.BillingSummary
              header={{
                title: 'Summary',
                addon: (
                  <SeatsInput min={1} value={numSeats} error={numSeats > editorPlanSeatLimits} onChange={setNumSeats} />
                ),
                description: (
                  <div>
                    {numSeats > editorPlanSeatLimits ? (
                      <Workspace.TakenSeatsMessage seats={editorPlanSeatLimits} error small />
                    ) : (
                      <SectionV2.Description>
                        {currency.formatUSD(pricePerEditor, { noDecimal: true })}

                        <Text color="#62778C" paddingLeft="3px">
                          per Editor, per {billingPeriod === BillingPeriod.ANNUALLY ? 'year' : 'month'}
                        </Text>
                      </SectionV2.Description>
                    )}
                  </div>
                ),
              }}
              items={[{ description: `${numSeats} Editor seats`, value: currency.formatUSD(totalPriceForEditors) }]}
              footer={{
                value: currency.formatUSD(totalPriceForEditors),
                // eslint-disable-next-line no-nested-ternary
                description: isOnProTrial
                  ? 'Total Due During Pro Trial'
                  : shouldProrate
                    ? 'Due today'
                    : 'Cost on Next Billing Date',
              }}
            />

            <Modal.Footer gap={8}>
              <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
                Cancel
              </Button>

              <Button
                width={isReducing ? 136 : 110}
                onClick={onAddSeats}
                variant={Button.Variant.PRIMARY}
                disabled={numSeats === numberOfSeats || numSeats > editorPlanSeatLimits || closePrevented}
                isLoading={closePrevented}
              >
                {isReducing ? 'Reduce Seats' : 'Add seats'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  })
);

export default AddSeats;
