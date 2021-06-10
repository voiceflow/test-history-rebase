import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { Sentiment } from '@/models';
import { SentimentToSVGName } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';
import THEME from '@/styles/theme';

import { Container, IconContainer } from './components';

interface StatusIconsProps {
  sentiment?: Sentiment;
  reviewed?: boolean;
  saved?: boolean;
  id: string;
}

const StatusIcons: React.FC<StatusIconsProps> = ({ id, sentiment, reviewed = false, saved = false }) => {
  return (
    <Container className={`${ClassName.TRANSCRIPT_ITEM_STATUSES}-${id}`}>
      {saved && (
        <IconContainer>
          <SvgIcon icon="bookmark" color={THEME.colors.red} />
        </IconContainer>
      )}
      {reviewed && (
        <IconContainer>
          <SvgIcon icon="checkmarkFilled" color="#3e9e3e" />
        </IconContainer>
      )}
      {sentiment && (
        <IconContainer>
          <SvgIcon icon={SentimentToSVGName[sentiment]} size={20} />
        </IconContainer>
      )}
    </Container>
  );
};

export default StatusIcons;
