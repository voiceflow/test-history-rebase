import { Box, Button, ButtonVariant, Link, SvgIcon, Text, useSetup } from '@voiceflow/ui';
import React from 'react';

import { PLAN_INFO_LINK } from '@/constants';
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

            <Text fontWeight={600}>Transcripts</Text>

            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">Need conversation transcripts?</Text>
              <Link href={PLAN_INFO_LINK}>Learn more</Link>
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
