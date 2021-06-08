import React from 'react';

import { FlexApart } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import { Transcript } from '@/models/Transcript';

import { ContextSubtext, ContextTitle, StyledLogo, StyledUser } from './components';

interface TranscriptContextProps {
  transcript: Transcript;
}

export const TranscriptContext: React.FC<TranscriptContextProps> = ({ transcript }) => {
  return (
    <>
      <FlexApart>
        <StyledLogo>
          <SvgIcon icon="voiceflowV" size={24} />
        </StyledLogo>
        <StyledUser key={transcript.creatorID} icon="userPlaceholder" size={48} color="#f0f0f0" />
      </FlexApart>
      <ContextTitle>Conversation between your assistant and a test user</ContextTitle>
      <ContextSubtext>Desktop&nbsp; •&nbsp; MacOS&nbsp; •&nbsp; Chrome</ContextSubtext>
    </>
  );
};
