import { Utils } from '@voiceflow/common';
import { Alert, Box, Button, Input, Modal, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import Workspace from '@/components/Workspace';
import { TEAM_INCREASE_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import manager from '../../manager';

const ScheduleSeatChange = manager.create('ScheduleSeatChange', () => ({ api, type, opened, hidden, animated }) => {
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const [numSeats, setNumSeats] = React.useState(usedEditorSeats);
  const pricePerEditor = 50;
  const nextBillingDate = '10 Oct 2022';
  const onScheduleSeatChange = () => {};

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Schedule Seat Change</Modal.Header>

      <SectionV2.SimpleSection headerProps={{ topUnit: 0, bottomUnit: 2.5 }}>
        <SectionV2.Description secondary lineHeight="20px">
          You can schedule a change number of Editor Seats you have on your next billing date on {nextBillingDate}. You currently have{' '}
          {usedEditorSeats} Editor seats.
        </SectionV2.Description>
      </SectionV2.SimpleSection>

      {numSeats < usedEditorSeats && (
        <SectionV2.SimpleSection headerProps={{ topUnit: 0.5, bottomUnit: 2.5 }}>
          <Alert title={<Alert.Title>You're reducing the number of Editor seats</Alert.Title>}>
            If you are using more than {numSeats} Editor seats on your next billing date, we will downgrade {usedEditorSeats - numSeats} Editor to
            Viewer.
          </Alert>
        </SectionV2.SimpleSection>
      )}

      <SectionV2.Divider />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart gap={4} column>
            <Text fontWeight={600}>Summary</Text>

            <div>
              {numSeats > TEAM_INCREASE_LIMIT ? (
                <Workspace.TakenSeatsMessage seats={TEAM_INCREASE_LIMIT} error small />
              ) : (
                <SectionV2.Description>
                  ${pricePerEditor}
                  <Text color="#62778C" paddingLeft="3px">
                    per Editor, per month
                  </Text>
                </SectionV2.Description>
              )}
            </div>
          </Box.FlexAlignStart>

          <Input.Counter
            value={numSeats}
            error={numSeats > TEAM_INCREASE_LIMIT}
            onPlusClick={() => setNumSeats(numSeats + 1)}
            onMinusClick={() => setNumSeats(Math.max(0, numSeats - 1))}
          />
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection minHeight={50} headerProps={{ topUnit: 2, bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Description>{numSeats} Editor seats</SectionV2.Description>
          <SectionV2.Description>${numSeats * pricePerEditor}.00</SectionV2.Description>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 4 }}>
        <Box.FlexApart fontWeight={600} fullWidth>
          <span>Cost on Next Billing Date</span>
          <span>${numSeats * pricePerEditor}.00</span>
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <Modal.Footer gap={8}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} squareRadius>
          Cancel
        </Button>

        <Button
          onClick={Utils.functional.chainVoid(api.close, () => onScheduleSeatChange())}
          variant={Button.Variant.PRIMARY}
          disabled={numSeats === usedEditorSeats || numSeats > TEAM_INCREASE_LIMIT}
        >
          Schedule Seat Change
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ScheduleSeatChange;
