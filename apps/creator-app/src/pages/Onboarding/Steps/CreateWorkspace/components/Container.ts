import { Animations } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const Container = styled(Animations.FadeLeft)<{ width?: number; textAlign?: string }>`
  ${({ width }) =>
    width
      ? css`
          width: ${width}px;
        `
      : css`
          width: 480px;
        `};

  ${({ textAlign = 'center' }) =>
    css`
      text-align: ${textAlign};
    `};

  padding-top: 65px;
`;

export default Container;
