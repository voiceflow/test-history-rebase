import { Utils } from '@voiceflow/common';
import { BillingPeriod } from '@voiceflow/internal';
import { Alert, Button, Link, Modal, SectionV2, Spinner, Text, withProvider } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import Workspace, { Hooks as WorkspaceHooks } from '@/components/Workspace';
import { TEAM_INCREASE_LIMIT } from '@/config/planLimitV2/editorSeats';
import { PaymentProvider } from '@/contexts/PaymentContext';
import * as Payment from '@/contexts/PaymentContext';
import * as Session from '@/ducks/session';
import { UpgradePrompt } from '@/ducks/tracking/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useTrackingEvents } from '@/hooks/';
import { useSelector } from '@/hooks/redux';
import * as currency from '@/utils/currency';
import { onOpenBookDemoPage } from '@/utils/upgrade';

import manager from '../../manager';
import * as S from './styles';

const AddSeats = manager.create('AddSeats', () =>
  withProvider(PaymentProvider)(({ api, type, opened, hidden, animated }) => {
    const currentNumberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
    const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
    const paymentAPI = Payment.usePaymentAPI();
    const [trackingEvents] = useTrackingEvents();

    const { billingPeriod } = WorkspaceHooks.useSubscriptionInfo();
    const { nextBillingDate = null } = paymentAPI.planSubscription ?? {};

    const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [numSeats, setNumSeats] = React.useState(currentNumberOfSeats);

    const isAnnual = billingPeriod === BillingPeriod.ANNUALLY;
    const isIncreasing = numSeats > currentNumberOfSeats;

    const pricePerEditor = !isPaidPlan ? 0 : 50;

    const onAddSeats = async () => {
      api.preventClose();
      setSubmitting(true);
      await client.workspace.updatePlanSubscriptionSeats(workspaceID, { seats: numSeats, schedule: false });
      api.enableClose();
      api.close();
    };

    const onContactSales = () => {
      trackingEvents.trackContactSales({ promptType: UpgradePrompt.EDITOR_SEATS });

      onOpenBookDemoPage();
    };

    return (
      <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
        <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Add Editor Seats</Modal.Header>

        {!paymentAPI.isReady ? (
          <Spinner borderLess />
        ) : (
          <>
            <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
              <SectionV2.Description secondary lineHeight="20px">
                {isPaidPlan ? (
                  <>
                    Your workspace currently has {currentNumberOfSeats} Editor seat{currentNumberOfSeats > 1 && 's'}. Seats you add here are available
                    immediately and are billed on a pro-rata basis until the next billing date on {nextBillingDate}.
                  </>
                ) : (
                  <>
                    Free Workspaces can add up to 5 editors. If you need more, <Link onClick={onContactSales}>contact our sales team!</Link>
                  </>
                )}
              </SectionV2.Description>
            </SectionV2.SimpleSection>

            {numSeats < currentNumberOfSeats && (
              <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2.5 }}>
                <Alert title={<Alert.Title>You're reducing the number of Editor seats</Alert.Title>}>
                  If you are using more than {numSeats} Editor seats on your next billing date, we will downgrade {currentNumberOfSeats - numSeats}{' '}
                  Editor to Viewer.
                </Alert>
              </SectionV2.SimpleSection>
            )}

            <SectionV2.Divider />

            <Workspace.BillingSummary
              header={{
                title: 'Summary',
                addon: (
                  <S.StyledInput
                    value={numSeats}
                    error={numSeats > TEAM_INCREASE_LIMIT}
                    onPlusClick={() => setNumSeats(numSeats + 1)}
                    onMinusClick={() => setNumSeats(Math.max(0, numSeats - 1))}
                  />
                ),
                description: (
                  <div>
                    {numSeats > TEAM_INCREASE_LIMIT ? (
                      <Workspace.TakenSeatsMessage seats={TEAM_INCREASE_LIMIT} error small />
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
              items={[{ description: `${numSeats} Editor seats`, value: currency.formatUSD(numSeats * pricePerEditor) }]}
              footer={{
                description: isIncreasing && isAnnual ? 'Due today' : 'Cost on Next Billing Date',
                value: currency.formatUSD(numSeats * pricePerEditor),
              }}
            />

            <Modal.Footer gap={8}>
              <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
                Cancel
              </Button>

              <Button
                onClick={Utils.functional.chainVoid(api.close, () => onAddSeats())}
                variant={Button.Variant.PRIMARY}
                disabled={numSeats === currentNumberOfSeats || numSeats > TEAM_INCREASE_LIMIT || isSubmitting}
                loading={isSubmitting}
              >
                Add seats
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    );
  })
);

export default AddSeats;
