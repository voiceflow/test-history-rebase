import { Box, Button, ButtonVariant, Link, SvgIcon, Text, useSetup } from '@voiceflow/ui';
import React from 'react';

import { PROTOTYPING } from '@/config/documentation';
import { UpgradePrompt } from '@/ducks/tracking';
import { useTrackingEvents } from '@/hooks/tracking';
import { usePaymentModal } from '@/ModalsV2/hooks';

import { SvgShadow, TranscriptsBackgroundContainer, UpgradeBox } from './components';

const GatedTranscripts: React.FC = () => {
  const [trackingEvents] = useTrackingEvents();
  const paymentModal = usePaymentModal();

  useSetup(() => {
    trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.TRANSCRIPTS });
  });

  return (
    <>
      <TranscriptsBackgroundContainer />

      <Box.FlexCenter position="fixed" zIndex={999}>
        <UpgradeBox>
          <Box.FlexCenter flexDirection="column">
            <SvgShadow>
              <SvgIcon icon="skillTemplate" size={80} />
            </SvgShadow>

            <Text fontWeight={600}>Need conversation transcripts?</Text>

            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">Review and improve your assistant with transcript data from tests and prototype sessions.</Text>
              <Link href={PROTOTYPING}>Learn more</Link>
            </Box>

            <Button variant={ButtonVariant.PRIMARY} onClick={() => paymentModal.openVoid({})}>
              Upgrade to Team
            </Button>
          </Box.FlexCenter>
        </UpgradeBox>
      </Box.FlexCenter>
    </>
  );
};

export default GatedTranscripts;
