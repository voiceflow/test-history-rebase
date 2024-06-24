import { PlanName } from '@voiceflow/dtos';
import { Alert, Button, Modal, SectionV2, Spinner, Text, toast, withProvider } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import * as Workspace from '@/components/Workspace';
import { PlansProvider, usePlans } from '@/contexts/Plans/Plans.context';
import * as Organization from '@/ducks/organization';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useTrackingEvents } from '@/hooks/';
import { useSelector } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';
import * as currency from '@/utils/currency';

import { MAX_SEATS } from '../billing.constants';
import SeatsInput from '../SeatsInput';
import { useAddSeatsCheckoutPayment } from './addSeatsCheckout.hook';

export const AddSeats = manager.create('BillingAddSeats', () =>
  withProvider(PlansProvider)(({ api, type, opened, hidden, animated, closePrevented }) => {
    const subscription = useSelector(Organization.chargebeeSubscriptionSelector);
    const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);

    const udpateSeats = useAddSeatsCheckoutPayment({ modalProps: { api } });

    const [trackingEvents] = useTrackingEvents();
    const plansAPI = usePlans();

    const [numSeats, setNumSeats] = React.useState(numberOfSeats);
    const unitPrice = subscription?.planAmount ?? 0;

    const totalPriceForEditors = numSeats * unitPrice;

    const isReducing = numSeats < numberOfSeats;
    const isIncreasing = numSeats > numberOfSeats;

    const maxSeats = Math.max(MAX_SEATS[subscription?.plan ?? PlanName.STARTER], subscription?.editorSeats ?? 1);
    const shouldProrate = isIncreasing;

    const onAddSeats = async () => {
      api.preventClose();

      try {
        await udpateSeats(numSeats);

        trackingEvents.trackSeatChange({ reduced: isReducing, scheduled: false });

        api.enableClose();
        api.close();
      } catch {
        api.enableClose();
        toast.error('Failed to update seats. Please try again later.');
      }
    };

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Add Editor Seats</Modal.Header>

        {plansAPI.loading ? (
          <Spinner borderLess />
        ) : (
          <>
            <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
              <SectionV2.Description secondary lineHeight="20px">
                Your organization currently has {numberOfSeats} Editor {pluralize('seat', numberOfSeats)}. Seats you add
                here are available immediately and are billed on a pro-rata basis until the next billing date on{' '}
                {subscription?.nextBillingDate}.
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
                addon: <SeatsInput min={1} value={numSeats} error={numSeats > maxSeats} onChange={setNumSeats} />,
                description: (
                  <div>
                    {numSeats > maxSeats ? (
                      <Workspace.TakenSeatsMessage seats={maxSeats} error small />
                    ) : (
                      <SectionV2.Description>
                        {currency.formatUSD(unitPrice, { noDecimal: true, unit: 'cent' })}

                        <Text color="#62778C" paddingLeft="3px">
                          per Editor, per {subscription?.billingPeriodUnit}
                        </Text>
                      </SectionV2.Description>
                    )}
                  </div>
                ),
              }}
              items={[
                {
                  description: `${numSeats} Editor seats`,
                  value: currency.formatUSD(totalPriceForEditors, { unit: 'cent' }),
                },
              ]}
              footer={{
                value: currency.formatUSD(totalPriceForEditors, { unit: 'cent' }),

                description: shouldProrate ? 'Due today' : 'Cost on Next Billing Date',
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
                disabled={numSeats === numberOfSeats || numSeats > maxSeats || closePrevented}
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
