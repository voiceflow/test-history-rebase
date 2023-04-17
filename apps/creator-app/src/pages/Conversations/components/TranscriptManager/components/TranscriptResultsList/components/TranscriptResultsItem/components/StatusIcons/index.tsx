import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { Sentiment } from '@/models';
import { SentimentToPNGName } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';

import { Container, EmotionContainer, IconContainer } from './components';

interface StatusIconsProps {
  id: string;
  saved?: boolean;
  reviewed?: boolean;
  sentiment?: Sentiment;
}

const StatusIcons: React.FC<StatusIconsProps> = ({ id, sentiment, reviewed = false, saved = false }) => {
  if (!saved && !reviewed && !sentiment) return null;

  return (
    <Container className={`${ClassName.TRANSCRIPT_ITEM_STATUSES}-${id}`}>
      {saved && (
        <IconContainer className={ClassName.SAVED_FOR_LATER_CONTAINER}>
          <SvgIcon icon="bookmarkActive" color="#bf395b" />
        </IconContainer>
      )}

      {reviewed && (
        <IconContainer className={ClassName.MARK_AS_REVIEWED_CONTAINER}>
          <SvgIcon icon="checkmarkFilled" color="#449127" />
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
