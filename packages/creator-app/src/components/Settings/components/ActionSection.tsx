import { FlexApart } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

const Container = styled(FlexApart)`
  padding: 24px 32px;
`;

const LeftSection = styled.div`
  flex: 5;
`;

const RightSection = styled.div`
  flex: 1;
`;

const Heading = styled.div`
  color: #132144;
  margin-bottom: 4px;
  font-size: 15px;
  font-weight: 600;
`;

const Description = styled.div`
  color: #62778c;
  font-size: 13px;
`;

const ActionSection: React.FC<{ heading: string; description: string; action: React.ReactNode }> = ({ heading, description, action }) => (
  <Container>
    <LeftSection>
      <Heading>{heading}</Heading>
      <Description>{description}</Description>
    </LeftSection>
    <RightSection>{action}</RightSection>
  </Container>
);

export default ActionSection;
