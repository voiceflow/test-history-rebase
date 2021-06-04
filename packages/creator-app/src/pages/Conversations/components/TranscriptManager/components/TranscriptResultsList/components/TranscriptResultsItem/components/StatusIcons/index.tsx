import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { Sentiment } from '@/models';
import { ClassName } from '@/styles/constants';
import THEME from '@/styles/theme';

import { Container, IconContainer } from './components';

interface StatusIconsProps {
  sentiment?: Sentiment;
  reviewed?: boolean;
  saved?: boolean;
  id: string;
}

const StatusIcons: React.FC<StatusIconsProps> = ({ id, reviewed = false, saved = false }) => {
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
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <IconContainer>😊</IconContainer>
    </Container>
  );
};

export default StatusIcons;
