import React from 'react';

import { FlexCenter } from '@/componentsV2/Flex';
import { styled } from '@/hocs';

const Label = styled.div`
  margin: 8px;
  padding: 8px;
  color: #9c9c9c;
  border-bottom: 2px solid #9c9c9c75;
`;

const Container = styled(FlexCenter)`
  padding: 24px;
  flex-direction: column;
  flex: 1;
  align-self: flex-start;
`;

const Content = styled.div`
  position: relative;
  margin: 8px;
`;

function StoryDetails({ name, labeled = true, children }) {
  return (
    <Container>
      {labeled && <Label>{name}</Label>}
      <Content>{children}</Content>
    </Container>
  );
}

export default StoryDetails;
