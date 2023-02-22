import { Utils } from '@voiceflow/common';
import { BillingPeriod } from '@voiceflow/internal';
import { Alert, Button, Modal, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Workspace from '@/components/Workspace';
import { TEAM_INCREASE_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks/redux';
import * as currency from '@/utils/currency';

import manager from '../../manager';
import * as S from './styles';

interface ScheduleSeatChangeProps {
  nextBillingDate: string;
  pricePerEditor: number;
  scheduleOrCurrentEditorSeats: number;
  billingPeriod?: BillingPeriod;
}

const ScheduleSeatChange = manager.create<ScheduleSeatChangeProps>(
  'ScheduleSeatChange',
  () =>
    ({ api, type, opened, hidden, animated, nextBillingDate, pricePerEditor, scheduleOrCurrentEditorSeats, billingPeriod }) => {
      const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
      const [isSubmitting, setSubmitting] = React.useState(false);
      const [numSeats, setNumSeats] = React.useState(scheduleOrCurrentEditorSeats);

      const isAnnual = billingPeriod === BillingPeriod.ANNUALLY;
      const isIncreasing = numSeats > scheduleOrCurrentEditorSeats;

      const onScheduleSeatChange = async () => {
        api.preventClose();
        setSubmitting(true);
        await client.workspace.updatePlanSubscriptionSeats(workspaceID, { seats: numSeats, schedule: true });
        api.enableClose();
        api.close();
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Schedule Seat Change</Modal.Header>

          <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2 }}>
            <SectionV2.Description secondary lineHeight="20px">
              You can schedule a change number of Editor Seats you have on your next billing date on {nextBillingDate}. You currently have{' '}
              {scheduleOrCurrentEditorSeats} Editor seats.
            </SectionV2.Description>
          </SectionV2.SimpleSection>

          {numSeats < scheduleOrCurrentEditorSeats && (
            <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2.5 }}>
              <Alert title={<Alert.Title>You're reducing the number of Editor seats</Alert.Title>}>
                If you are using more than {numSeats} Editor seats on your next billing date, we will downgrade{' '}
                {scheduleOrCurrentEditorSeats - numSeats} Editor to Viewer.
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
              onClick={Utils.functional.chainVoid(api.close, () => onScheduleSeatChange())}
              variant={Button.Variant.PRIMARY}
              disabled={numSeats === scheduleOrCurrentEditorSeats || numSeats > TEAM_INCREASE_LIMIT}
              loading={isSubmitting}
            >
              {isAnnual && isIncreasing ? 'Add seats and pay' : 'Schedule Seat Change'}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default ScheduleSeatChange;
