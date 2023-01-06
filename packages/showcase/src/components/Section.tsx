import { SvgIcon } from '@voiceflow/ui';
import React from 'react';
import styled, { css } from 'styled-components';

import { uiProjectDir } from '@/config';

const Container = styled.section<{ inline?: boolean }>`
  margin: ${({ inline }) => (inline ? '0' : '1em 0 3em 0')};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  font-size: 2em;
  margin-bottom: 0.5em;
`;

const Content = styled.div<{ inline?: boolean }>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: #f9f9f9;

  ${({ inline }) =>
    !inline &&
    css`
      justify-content: space-around;
      border: 1px solid #dedede;
      border-radius: 8px;
    `}
`;

const Title = styled.h2`
  color: #b1b0b0;

  &:not(:last-child) {
    margin-right: 0.5em;
  }

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      &:hover {
        color: #a4a3a3;
      }
    `}
`;

interface SectionProps extends React.PropsWithChildren {
  path: string;
  title: string;
  inline?: boolean;
  onTitleClick?: VoidFunction;
}

const Section: React.FC<SectionProps> = ({ title, path, children, inline, onTitleClick }) => (
  <Container inline={inline}>
    {!inline && (
      <Header>
        <Title onClick={onTitleClick}>{title}</Title>

        <a href={`${uiProjectDir}/${path}`}>
          <SvgIcon icon="link" size={20} />
        </a>
      </Header>
    )}

    {children && <Content inline={inline}>{children}</Content>}
  </Container>
);

export default Section;
