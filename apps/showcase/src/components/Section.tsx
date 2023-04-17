import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { uiProjectDir } from '@/config';

const Container = styled.section<{ inline?: boolean }>`
  margin: ${({ inline }) => (inline ? '0' : '1em 0 3em 0')};
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const Content = styled.div<{ inline?: boolean }>`
  background: #f9f9f9;

  ${({ inline }) =>
    !inline &&
    css`
      border: 1px solid #dedede;
      border-radius: 8px;
    `}
`;

const Title = styled.h2`
  color: #132144;
  font-size: 24px;
  margin-bottom: 0;

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    `}
`;

const Description = styled.p`
  color: #62778c;
  font-size: 16px;
  margin-bottom: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

interface SectionProps extends React.PropsWithChildren {
  path: string;
  title: string;
  inline?: boolean;
  description?: string;
  onTitleClick?: VoidFunction;
}

const Section: React.FC<SectionProps> = ({ title, path, children, inline, description, onTitleClick }) => (
  <Container inline={inline}>
    {!inline && (
      <Header>
        <Box.Flex gap={12}>
          <a href={`${uiProjectDir}/${path}`}>
            <SvgIcon icon="link" size={20} />
          </a>

          <Title onClick={onTitleClick}>{title}</Title>
        </Box.Flex>

        {description && <Description>{description}</Description>}
      </Header>
    )}

    {children && <Content inline={inline}>{children}</Content>}
  </Container>
);

export default Section;
