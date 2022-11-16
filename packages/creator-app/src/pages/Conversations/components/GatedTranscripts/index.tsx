import { PlanType } from '@voiceflow/internal';
import { Box, BoxFlexCenter, Button, ButtonVariant, Link, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { TranscriptsLimitDetails } from '@/config/planLimits/transcripts';
import { ModalType, PLAN_INFO_LINK } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';

import { SvgShadow, TranscriptsBackgroundContainer, UpgradeBox } from './components';

const GatedTranscripts: React.FC = () => {
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);
  const [trackingEvents] = useTrackingEvents();
  trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.TRANSCRIPTS });

  return (
    <>
      <TranscriptsBackgroundContainer />
      <BoxFlexCenter position="fixed" zIndex={999}>
        <UpgradeBox>
          <BoxFlexCenter flexDirection="column">
            <SvgShadow>
              <SvgIcon icon="skillTemplate" size={80} />
            </SvgShadow>
            <Text fontWeight={600}>{TranscriptsLimitDetails.title}</Text>
            <Box mt="8px" mb="20px" textAlign="center">
              <Text color="#62778c">{TranscriptsLimitDetails.description}</Text>
              <Link href={PLAN_INFO_LINK}>Learn more</Link>
            </Box>
            <Button variant={ButtonVariant.PRIMARY} onClick={() => TranscriptsLimitDetails.onSubmit({ openPaymentModal })}>
              {TranscriptsLimitDetails.submitText}
            </Button>
          </BoxFlexCenter>
        </UpgradeBox>
      </BoxFlexCenter>
    </>
  );
};

export default GatedTranscripts;
