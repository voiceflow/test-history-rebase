import dayjs from 'dayjs';
import React from 'react';

import { ClassName } from '@/styles/constants';

import { Container, MetaContainer, MetaInfoSection, Name } from './components';

interface InfoSection {
  name: string;
  date: number;
  tags: string[];
  active: boolean;
  isRead: boolean;
}

const InfoSection: React.FC<InfoSection> = ({ active, name, date, isRead, tags }) => {
  const formattedDate = React.useMemo(() => `${dayjs(date).format('h:mm a, MMM D')}`, [date]);

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
