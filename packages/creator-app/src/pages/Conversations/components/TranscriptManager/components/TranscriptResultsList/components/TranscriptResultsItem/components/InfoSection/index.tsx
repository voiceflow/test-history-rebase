import { Box } from '@voiceflow/ui';
import moment from 'moment';
import React from 'react';

import { mapReportTagsSelector } from '@/ducks/reportTag';
import { useSelector } from '@/hooks';

import { Container, MetaContainer, Name } from './components';

interface InfoSection {
  name: string;
  date: number;
  isRead: boolean;
  tags: string[];
}

const InfoSection: React.FC<InfoSection> = ({ name, date, isRead, tags }) => {
  const tagsMap = useSelector(mapReportTagsSelector);
  const formattedDate = `${moment(date).format('LT').toLocaleLowerCase()}, ${moment(date).format('MMMM Do')}`;

  return (
    <Container>
      <Name>{name || 'Test User'}</Name>
      <MetaContainer>
        {formattedDate}
        <Box display="inline" mr={6} ml={6}>
          •
        </Box>
        {isRead ? (
          <span>
            {tags.map((tag) => {
              return tagsMap[tag]?.label;
            })}
          </span>
        ) : (
          <span>Unread</span>
        )}
      </MetaContainer>
    </Container>
  );
};

export default InfoSection;
