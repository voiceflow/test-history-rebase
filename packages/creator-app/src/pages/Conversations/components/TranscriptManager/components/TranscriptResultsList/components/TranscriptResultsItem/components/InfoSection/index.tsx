import { Box } from '@voiceflow/ui';
import React from 'react';

import { Container, MetaContainer, Name } from './components';

interface InfoSection {
  name: string;
  date: string;
  isRead: boolean;
  tags: string[];
}

const InfoSection: React.FC<InfoSection> = ({ name, date, isRead, tags }) => {
  return (
    <Container>
      <Name>{name}</Name>
      <MetaContainer>
        {date}
        <Box display="inline" mr={6} ml={6}>
          •
        </Box>
        {isRead ? (
          <span>
            {tags.map((tag) => {
              return tag;
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
