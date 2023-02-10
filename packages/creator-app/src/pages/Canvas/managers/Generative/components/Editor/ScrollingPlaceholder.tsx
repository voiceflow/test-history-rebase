import React from 'react';

import { keyframes, styled } from '@/hocs/styled';

const HEIGHT = 42;
const DURATION = 3000;
const TRANSITION = 150;

const getTextScrollKeyframe = (length: number) => {
  const offset = 100 / length;
  const animation = [];

  const percentageDiff = offset * (TRANSITION / DURATION);

  for (let i = 0; i < length; i++) {
    animation.push(`${i * offset}%, ${i * offset + offset - percentageDiff}% { transform: translateY(-${i * HEIGHT}px) translate3d(0, 0, 0); }`);
  }
  animation.push(`${100}% { transform: translateY(-${length * HEIGHT}px) translate3d(0, 0, 0); }`);

  return keyframes`${animation.join('\n')}`;
};

const List = styled.ul<{ length: number }>`
  top: 0;
  position: absolute;
  list-style: none;
  padding-left: 17px;
  pointer-events: none;
  color: #8da2b5;
  transform: translateY(0) translate3d(0, 0, 0);
  animation: ${({ length }) => getTextScrollKeyframe(length)} ${({ length }) => `${length * DURATION}ms`} ease-in-out infinite normal;

  li {
    padding: 10px 0;
    line-height: 22px;
  }
`;

const Container = styled.div`
  position: relative;
  overflow: hidden;

  &:focus-within ${List} {
    display: none;
  }
`;

interface ScrollingPlaceholderProps extends React.PropsWithChildren {
  hasContent: boolean;
  placeholders: string[];
}

const ScrollingPlaceholder: React.FC<ScrollingPlaceholderProps> = ({ children, placeholders, hasContent }) => {
  const elements = React.useMemo(() => [...placeholders, placeholders[0]], [placeholders]);
  return (
    <Container>
      {children}

      {!hasContent && (
        <List length={placeholders.length}>
          {elements.map((placeholder, index) => (
            <li key={index}>{placeholder}</li>
          ))}
        </List>
      )}
    </Container>
  );
};

export default ScrollingPlaceholder;
