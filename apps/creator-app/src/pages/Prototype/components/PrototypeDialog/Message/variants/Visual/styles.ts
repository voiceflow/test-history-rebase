import { styled } from '@/hocs/styled';

import BaseMessage from '../../Base';

export const VisualContainer = styled.div`
  ${BaseMessage.Container} {
    display: block;
  }
`;

export const Image = styled.img<{ borderRadius?: number }>`
  width: 100%;
  max-width: 306px;
  border-radius: ${({ borderRadius }) => `${borderRadius ?? 5}px`};
`;
