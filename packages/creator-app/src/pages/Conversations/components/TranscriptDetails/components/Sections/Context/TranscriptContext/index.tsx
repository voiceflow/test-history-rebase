import React from 'react';
import { useSelector } from 'react-redux';

import { FlexApart } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';

import { ContextSubtext, ContextTitle, StyledLogo, StyledUser } from './components';

const TranscriptContext: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { device, os, browser, creatorID } = currentTranscript;

  return (
    <>
      <FlexApart>
        <StyledLogo>
          <SvgIcon icon="voiceflowV" size={24} />
        </StyledLogo>
        <StyledUser icon="userPlaceholder" size={48} color="#f0f0f0" />
      </FlexApart>
      <ContextTitle>Conversation between your assistant and {creatorID || 'a test user'}</ContextTitle>
      <ContextSubtext>
        {device}&nbsp; •&nbsp; {os}&nbsp; •&nbsp; {browser}
      </ContextSubtext>
    </>
  );
};

export default TranscriptContext;
