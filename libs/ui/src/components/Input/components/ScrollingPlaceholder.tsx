import { keyframes, styled } from '@ui/styles';
import { listResetStyle } from '@ui/styles/bootstrap';
import React from 'react';

const HEIGHT = 42;

interface TextScrollKeyframeProps {
  length: number;
  transition: number; // length of time to transition between elements
  duration: number; // length of time on each element
}

const getTextScrollKeyframe = ({ length, transition, duration }: TextScrollKeyframeProps) => {
  const offset = 100 / length;
  const animation = [];

  const percentageDiff = offset * (transition / duration);

  for (let i = 0; i < length; i++) {
    animation.push(`${i * offset}%, ${i * offset + offset - percentageDiff}% { transform: translateY(-${i * HEIGHT}px) translate3d(0, 0, 0); }`);
  }
  animation.push(`${100}% { transform: translateY(-${length * HEIGHT}px) translate3d(0, 0, 0); }`);

  return keyframes`${animation.join('\n')}`;
};

const List = styled.ul<TextScrollKeyframeProps>`
  top: 0;
  position: absolute;
  list-style: none;
  padding-left: 17px;
  color: #8da2b5;
  transform: translateY(0) translate3d(0, 0, 0);
  animation: ${({ length, transition, duration }) => getTextScrollKeyframe({ length, transition, duration })}
    ${({ length, duration }) => `${length * duration}ms`} ease-in-out infinite normal;

  li {
    padding: 10px 0;
    line-height: 22px;
  }

  ${listResetStyle}
`;

const Frame = styled.div`
  pointer-events: none;
  position: absolute;
  overflow: hidden;
  inset: 0;
`;

const Container = styled.div`
  position: relative;

  .public-DraftEditorPlaceholder-root {
    visibility: hidden;
  }

  &:focus-within {
    .public-DraftEditorPlaceholder-root {
      visibility: visible;
    }
    & ${Frame} {
      visibility: hidden;
    }
  }
`;

export interface ScrollingPlaceholderProps extends React.PropsWithChildren, Partial<Omit<TextScrollKeyframeProps, 'length'>> {
  hasContent: boolean;
  placeholders: string[];
}

const ScrollingPlaceholder: React.FC<ScrollingPlaceholderProps> = ({ children, placeholders, hasContent, transition = 150, duration = 3000 }) => {
  const elements = React.useMemo(() => [...placeholders, placeholders[0]], [placeholders]);
  return (
    <Container>
      {children}

      {!hasContent && (
        <Frame>
          <List length={placeholders.length} transition={transition} duration={duration}>
            {elements.map((placeholder, index) => (
              <li key={index}>{placeholder}</li>
            ))}
          </List>
        </Frame>
      )}
    </Container>
  );
};

export default ScrollingPlaceholder;
