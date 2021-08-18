import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Sentiment } from '@/models';
import { SentimentToPNGName } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';
import THEME from '@/styles/theme';

import { Container, EmotionContainer, IconContainer } from './components';

interface StatusIconsProps {
  sentiment?: Sentiment;
  reviewed?: boolean;
  saved?: boolean;
  id: string;
}

const StatusIcons: React.FC<StatusIconsProps> = ({ sentiment, reviewed = false, saved = false }) => {
  if (!saved && !reviewed && !sentiment) {
    return null;
  }

  return (
    <Container className={`${ClassName.TRANSCRIPT_ITEM_STATUSES}`}>
      {saved && (
        <IconContainer className={ClassName.SAVED_FOR_LATER_CONTAINER}>
          <SvgIcon icon="bookmark" color={THEME.colors.red} />
        </IconContainer>
      )}
      {reviewed && (
        <IconContainer className={ClassName.MARK_AS_REVIEWED_CONTAINER}>
          <SvgIcon icon="checkmarkFilled" color="#3e9e3e" />
        </IconContainer>
      )}
      {sentiment && (
        <IconContainer isEmotion>
          <EmotionContainer src={SentimentToPNGName[sentiment]} />
        </IconContainer>
      )}
    </Container>
  );
};

export default StatusIcons;
