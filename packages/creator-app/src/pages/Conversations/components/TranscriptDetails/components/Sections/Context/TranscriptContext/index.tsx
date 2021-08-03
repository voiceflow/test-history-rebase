import { BoxFlexApart, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import * as Prototype from '@/ducks/prototype';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import { Workspace } from '@/models';

import { AvatarContainer, ContextSubtext, ContextTitle, DefaultUserContainer, LetterContainer, StyledLogo, StyledUser } from './components';

export type CreatorListParams = Pick<Workspace, 'name' | 'image'>;
interface TranscriptContextProps {
  creatorIDList: number[];
  creatorList: CreatorListParams[];
}

const TranscriptContext: React.FC<TranscriptContextProps> = ({ creatorIDList, creatorList }) => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { device, os, browser, creatorID } = currentTranscript;

  const index = creatorIDList.indexOf(Number(creatorID));

  const avatar = useSelector(Prototype.prototypeAvatarSelector);

  const userName = creatorIDList.includes(Number(creatorID)) ? creatorList[index].name : '';
  const userImage = creatorIDList.includes(Number(creatorID)) ? creatorList[index].image : '';

  const UserContainer = () => {
    let letter = '';
    let backgroundColor = '';
    let color = '';
    let isCustom = true;

    if (userImage.length === 13 && userImage.includes('|')) {
      const colors = userImage.split('|');
      backgroundColor = `#${colors[1]}`;
      color = `#${colors[0]}`;
      [letter] = userName;
      isCustom = false;
    }

    if (isCustom) {
      return <DefaultUserContainer src={userImage} />;
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
        {userImage ? <UserContainer /> : <StyledUser icon="userPlaceholder" size={48} color="#f0f0f0" />}
      </BoxFlexApart>
      <ContextTitle>Conversation between your assistant and {userName || 'a test user'}</ContextTitle>
      <ContextSubtext>
        {device}&nbsp; •&nbsp; {os}&nbsp; •&nbsp; {browser}
      </ContextSubtext>
    </>
  );
};

export default TranscriptContext;
