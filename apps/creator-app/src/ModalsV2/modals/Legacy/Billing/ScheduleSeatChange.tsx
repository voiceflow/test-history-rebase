import { BillingPeriod } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Modal, SectionV2, Text, toast } from '@voiceflow/ui';
import React from 'react';

import Alert from '@/components/Alert';
import * as Workspace from '@/components/Workspace';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSyncDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import * as currency from '@/utils/currency';

import manager from '../../../manager';
import SeatsInput from '../../Billing/SeatsInput';

interface ScheduleSeatChangeProps {
  billingPeriod?: BillingPeriod;
  pricePerEditor: number;
  nextBillingDate: string;
  scheduleOrCurrentEditorSeats: number;
}

const ScheduleSeatChange = manager.create<ScheduleSeatChangeProps>(
  'LegacyBillingScheduleSeatChange',
  () =>
    ({ api, type, opened, hidden, animated, nextBillingDate, pricePerEditor, scheduleOrCurrentEditorSeats, billingPeriod, closePrevented }) => {
      const [tracking] = useTrackingEvents();

      const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
      const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);

      const changeSeats = useSyncDispatch(Realtime.workspace.changeSeats);

      const [numSeats, setNumSeats] = React.useState(scheduleOrCurrentEditorSeats);

      const isAnnual = billingPeriod === BillingPeriod.ANNUALLY;
      const isReducing = numSeats < scheduleOrCurrentEditorSeats;
      const isIncreasing = numSeats > scheduleOrCurrentEditorSeats;

      const onScheduleSeatChange = async () => {
        api.preventClose();

        try {
          await changeSeats({ seats: numSeats, schedule: true, workspaceID });

          tracking.trackSeatChange({ reduced: isReducing, scheduled: true });

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
          toast.error('Failed to schedule seat change. Please try again later.');
        }
      };

      const shouldProrate = isAnnual && isIncreasing;

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>Schedule Seat Change</Modal.Header>

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
              addon: <SeatsInput value={numSeats} error={numSeats > editorPlanSeatLimits} onChange={setNumSeats} />,
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
            items={[{ description: `${numSeats} Editor seats`, value: currency.formatUSD(numSeats * pricePerEditor) }]}
            footer={{
              description: isIncreasing && isAnnual ? 'Due today' : 'Cost on Next Billing Date',
              value: currency.formatUSD(numSeats * pricePerEditor),
            }}
          />

          <Modal.Footer gap={8}>
            <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius disabled={closePrevented}>
              Cancel
            </Button>

            <Button
              width={shouldProrate ? 172 : 199}
              onClick={onScheduleSeatChange}
              variant={Button.Variant.PRIMARY}
              disabled={numSeats === scheduleOrCurrentEditorSeats || numSeats > editorPlanSeatLimits || closePrevented}
              isLoading={closePrevented}
            >
              {shouldProrate ? 'Add Seats and Pay' : 'Schedule Seat Change'}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default ScheduleSeatChange;
