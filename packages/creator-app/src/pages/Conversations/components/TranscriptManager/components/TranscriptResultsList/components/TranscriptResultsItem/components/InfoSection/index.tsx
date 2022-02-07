import dayjs from 'dayjs';
import React from 'react';

import { ClassName } from '@/styles/constants';

import { Container, MetaContainer, MetaInfoSection, Name } from './components';

interface InfoSection {
  active: boolean;
  name: string;
  date: number;
  isRead: boolean;
  tags: string[];
}

const InfoSection: React.FC<InfoSection> = ({ active, name, date, isRead, tags }) => {
  const formattedDate = `${dayjs(date).format('h:mm a, MMM Do')}`;

  return (
    <Container className={ClassName.TRANSCRIPT_ITEM_META}>
      <Name>{name || 'Test User'}</Name>
      <MetaContainer className={ClassName.TRANSCRIPT_DATE} isActive={active}>
        {formattedDate}
        <MetaInfoSection tags={tags} isRead={isRead} />
      </MetaContainer>
    </Container>
  );
};

export default InfoSection;
