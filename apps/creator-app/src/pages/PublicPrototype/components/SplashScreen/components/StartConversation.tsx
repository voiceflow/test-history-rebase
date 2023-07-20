import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Link, OverflowTippyTooltip, preventDefault, Text } from '@voiceflow/ui';
import React from 'react';

import { useFeature, useQuery } from '@/hooks';
import { Identifier } from '@/styles/constants';

import PrototypeStart from './PrototypeStart';
import StartButton from './StartButton';

export interface StartConversationProps {
  projectName: string;
  withStartButton?: boolean;
  isVisuals?: boolean;
  isMobile?: boolean;
  colorScheme?: string;
  hideVFBranding?: boolean;
  setVisualsWelcomeScreenPassed: (val: boolean) => void;
  onStart: () => void;
}

const NAME_MAX_LENGTH = 80;

const StartConversation: React.FC<StartConversationProps> = ({
  projectName,
  withStartButton,
  isVisuals,
  isMobile,
  colorScheme,
  setVisualsWelcomeScreenPassed,
  onStart,
  hideVFBranding,
}) => {
  const query = useQuery();
  const multiPersonaPrototype = useFeature(Realtime.FeatureFlag.MULTI_PERSONAS_PROTOTYPE);
  const onClick = React.useMemo(
    () => preventDefault(() => (isVisuals && isMobile ? setVisualsWelcomeScreenPassed(true) : onStart())),
    [isVisuals, isMobile, setVisualsWelcomeScreenPassed, onStart]
  );

  const persona = multiPersonaPrototype.isEnabled && query.get('persona');

  return (
    <Box>
      <Box fontSize={24}>
        You've been invited to have a conversation with
        <OverflowTippyTooltip content={projectName} isChildrenOverflow={() => projectName.length >= NAME_MAX_LENGTH}>
          {(ref, { isOverflow }) => (
            <Text ref={ref} ml={5} color={colorScheme || '#3d82e2'} fontWeight={600}>
              {isOverflow ? `${projectName.substring(0, NAME_MAX_LENGTH)}...` : projectName}
            </Text>
          )}
        </OverflowTippyTooltip>
      </Box>

      <Box fontSize={15} mt={16} mb={32} color="#62778c">
        {!hideVFBranding && (
          <>
            Want to create your own?
            {' ' /* Need this space for formatting */}
            <Link color={colorScheme || '#3d82e2'} href="https://www.voiceflow.com/">
              Get Started.
            </Link>
          </>
        )}
      </Box>

      {withStartButton && (
        <>
          {persona ? (
            <PrototypeStart onClick={onClick} color={colorScheme || '#3d82e2'} />
          ) : (
            <StartButton id={Identifier.PROTOTYPE_START} color={colorScheme || '#3d82e2'} onClick={onClick}>
              Start Conversation
            </StartButton>
          )}
        </>
      )}
    </Box>
  );
};

export default StartConversation;
