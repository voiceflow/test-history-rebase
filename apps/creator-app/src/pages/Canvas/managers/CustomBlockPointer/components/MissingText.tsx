import React from 'react';

import { styled } from '@/hocs/styled';

const Title = styled.div`
  margin-bottom: 4px;
  display: inline-block;
  color: ${({ theme }) => theme.colors.navy};
  font-size: ${({ theme }) => theme.fontSizes.s}px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.colors.cerulean};
  font-size: ${({ theme }) => theme.fontSizes.s}px;
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.skyBlue};
  padding: 16px 20px;
  border-radius: 8px;
  line-height: 20px;
`;

const MissingText: React.FC = () => (
  <Container>
    <Title>Custom block was deleted</Title>
    <br />
    <StyledSpan>
      Custom blocks source was deleted from your library. Remove or replace this step from your assistant.
    </StyledSpan>
  </Container>
);

export default MissingText;
