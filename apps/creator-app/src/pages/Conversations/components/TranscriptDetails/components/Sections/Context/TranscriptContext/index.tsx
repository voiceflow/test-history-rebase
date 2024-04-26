import { Box } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import { currentTranscriptSelector } from '@/ducks/transcript';
import { ClassName } from '@/styles/constants';

import {
  AvatarContainer,
  ContextSubtext,
  ContextTitle,
  DefaultUserContainer,
  LetterContainer,
  StyledLogo,
  StyledUser,
} from './components';

const TranscriptContext: React.FC = () => {
  const { device, os, browser, name, image } = useSelector(currentTranscriptSelector) ?? {};

  const avatar = useSelector(Prototype.prototypeAvatarSelector);

  const renderUserContainer = () => {
    let letter = '';
    let backgroundColor = '';
    let color = '';
    let isCustom = true;

    if (image?.length === 13 && image?.includes('|')) {
      const colors = image.split('|');
      backgroundColor = `#${colors[1]}`;
      color = `#${colors[0]}`;
      [letter] = name ?? '';
      isCustom = false;
    }

    if (isCustom) {
      return <DefaultUserContainer src={image} />;
    }

    return (
      <LetterContainer color={color} backgroundColor={backgroundColor}>
        <span>{letter}</span>
      </LetterContainer>
    );
  };

  const transcriptContextMeta = [device, os, browser].filter(Boolean).join('\u00A0 •\u00A0 ');

  const avatarUrl = avatar || 'https://cdn.voiceflow.com/assets/logomark.png';
  return (
    <>
      <Box.FlexApart>
        <StyledLogo isCustom>
          <AvatarContainer src={avatarUrl} />
        </StyledLogo>

        {image ? renderUserContainer() : <StyledUser icon="userConversation" size={48} color="#EDEDED" />}
      </Box.FlexApart>

      <ContextTitle className={ClassName.TRANSCRIPT_USER_NAME}>
        Conversation between your assistant and {name || 'a test user'}
      </ContextTitle>

      <ContextSubtext className={ClassName.TRANSCRIPT_CONTEXT_META}>{transcriptContextMeta}</ContextSubtext>
    </>
  );
};

export default TranscriptContext;
