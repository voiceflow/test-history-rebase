import { css, styled } from '@/hocs/styled';
import { FadeLeftContainer } from '@/styles/animations';

const Container = styled(FadeLeftContainer)<{ width?: number; textAlign?: string }>`
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
