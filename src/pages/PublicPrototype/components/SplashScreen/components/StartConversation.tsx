import React from 'react';

import Box from '@/components/Box';
import { Link, Text } from '@/components/Text/components';
import Tooltip from '@/components/TippyTooltip';
import { Identifier } from '@/styles/constants';
import { preventDefault } from '@/utils/dom';

import StartButton from './StartButton';

export type StartConversationProps = {
  projectName: string;
  withStartButton?: boolean;
  isVisuals?: boolean;
  isMobile?: boolean;
  colorScheme?: string;
  hideVFBranding?: boolean;
  setVisualsWelcomeScreenPassed: (val: boolean) => void;
  onStart: () => void;
};

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
  const onClick = React.useMemo(() => preventDefault(() => (isVisuals && isMobile ? setVisualsWelcomeScreenPassed(true) : onStart())), [
    isVisuals,
    isMobile,
    setVisualsWelcomeScreenPassed,
    onStart,
  ]);

  return (
    <Box>
      <Box fontSize={24}>
        You've been invited to have a conversation with
        {projectName.length > 120 ? (
          <Text color={colorScheme} trim>
            <Tooltip title={projectName}>
              <Box width={120} noOverflow ml={5}>
                {projectName}
              </Box>
            </Tooltip>
          </Text>
        ) : (
          <Text color={colorScheme} ml={5}>
            {projectName}
          </Text>
        )}
      </Box>

      <Box fontSize={15} mt={16} mb={32} color="#62778c">
        {!hideVFBranding && (
          <>
            Want to create your own?
            {' ' /* Need this space for formatting */}
            <Link color={colorScheme} href="https://www.voiceflow.com/">
              Get Started.
            </Link>
          </>
        )}
      </Box>

      {withStartButton && (
        <StartButton id={Identifier.PROTOTYPE_START} color={colorScheme} onClick={onClick}>
          Start Conversation
        </StartButton>
      )}
    </Box>
  );
};

export default StartConversation;
