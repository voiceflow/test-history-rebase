import { css, styled } from '@/hocs';

export type HeaderIconContainerProps = {
  side: 'left' | 'right';
};

const HeaderIconContainer = styled.div<HeaderIconContainerProps>`
  position: absolute;
  padding: 0 8px;
  overflow: hidden;

  ${({ side }) =>
    side === 'left'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;

export default HeaderIconContainer;
