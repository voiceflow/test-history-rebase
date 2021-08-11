import { Box } from '@voiceflow/ui';
import moment from 'moment';
import React from 'react';

import { mapReportTagsSelector } from '@/ducks/reportTag';
import { useSelector } from '@/hooks';
import { ALL_BUILTIN_TAGS_ARRAY, Sentiment, SystemTag } from '@/models';

import { Container, MetaContainer, Name } from './components';

interface InfoSection {
  active: boolean;
  name: string;
  date: number;
  isRead: boolean;
  tags: string[];
}

const InfoSection: React.FC<InfoSection> = ({ active, name, date, isRead, tags }) => {
  const tagsMap = useSelector(mapReportTagsSelector);
  const formattedDate = `${moment(date).format('LT').toLocaleLowerCase()}, ${moment(date).format('MMMM Do')}`;
  const MetaInfoSection = () => {
    const customTags = tags.filter((tag) => !ALL_BUILTIN_TAGS_ARRAY.includes(tag as SystemTag | Sentiment));
    if (!isRead) {
      return (
        <>
          <Box display="inline" mr={6} ml={6}>
            •
          </Box>
          <span>Unread</span>
        </>
      );
    }
    if (isRead && customTags.length > 0) {
      return (
        <>
          <Box display="inline" mr={6} ml={6}>
            •
          </Box>
          <span>
            {tags.map((tag) => {
              return tagsMap[tag]?.label;
            })}
          </span>
        </>
      );
    }
    return <></>;
  };

  return (
    <Container>
      <Name>{name || 'Test User'}</Name>
      <MetaContainer isActive={active}>
        {formattedDate}
        <MetaInfoSection />
      </MetaContainer>
    </Container>
  );
};

export default InfoSection;
