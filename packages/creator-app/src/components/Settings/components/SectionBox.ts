import { css, styled } from '@/hocs/styled';

import { SectionVariants } from '../constants';

const SectionBox = styled.div<{ width?: number; variant?: SectionVariants; noContentPadding?: boolean }>`
  border-radius: 8px;
  box-shadow: 0px 0px 0px 1px rgba(17, 49, 96, 0.1), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  overflow: hidden;
  ${({ variant = SectionVariants.PRIMARY }) =>
    variant === SectionVariants.PRIMARY
      ? css`
          background: #ffffff;
        `
      : css`
          background-color: rgb(249, 249, 249);
          background-image: repeating-linear-gradient(
            132deg,
            transparent,
            transparent 34px,
            rgba(216, 216, 216, 0.1) 18px,
            rgba(216, 216, 216, 0.1) 52px
          );
        `}
  ${({ width }) =>
    width
      ? css`
          width: ${width}px;
        `
      : css`
          width: 100%;
        `};

  ${({ noContentPadding }) =>
    noContentPadding &&
    css`
      padding: 0;
    `};
`;

export default SectionBox;
