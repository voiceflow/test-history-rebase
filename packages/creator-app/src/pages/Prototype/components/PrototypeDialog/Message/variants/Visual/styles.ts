import { styled } from '@/hocs';

import BaseMessage from '../../Base';

export const VisualContainer = styled.div`
  ${BaseMessage.Container} {
    display: block;
  }
`;

export const ImageContainer = styled.div<{ ratio: number; isFirstInSeries?: boolean }>`
  max-width: 306px;
  width: 100%;
`;
