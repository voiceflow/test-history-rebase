import { BoxFlexApart, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import { ClassName } from '@/styles/constants';

import { AvatarContainer, ContextSubtext, ContextTitle, DefaultUserContainer, LetterContainer, StyledLogo, StyledUser } from './components';

const TranscriptContext: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { device, os, browser, name, image } = currentTranscript;

  const avatar = useSelector(Prototype.prototypeAvatarSelector);

  const UserContainer = () => {
    let letter = '';
    let backgroundColor = '';
    let color = '';
    let isCustom = true;

    if (image.length === 13 && image.includes('|')) {
      const colors = image.split('|');
      backgroundColor = `#${colors[1]}`;
      color = `#${colors[0]}`;
      [letter] = name;
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

  return (
    <>
      <BoxFlexApart>
        <StyledLogo isCustom={!!avatar}>
          {avatar ? <AvatarContainer src={avatar} /> : <SvgIcon icon="voiceflowV" size={24} color="#fff" />}
        </StyledLogo>
        {image ? <UserContainer /> : <StyledUser icon="userPlaceholder" size={48} color="#f0f0f0" />}
      </BoxFlexApart>
      <ContextTitle className={ClassName.TRANSCRIPT_USER_NAME}>Conversation between your assistant and {name || 'a test user'}</ContextTitle>
      <ContextSubtext className={ClassName.TRANSCRIPT_CONTEXT_META}>
        {device}&nbsp; •&nbsp; {os}&nbsp; •&nbsp; {browser}
      </ContextSubtext>
    </>
  );
};

export default TranscriptContext;
