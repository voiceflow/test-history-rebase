import { css, styled } from '@/hocs';
import { Fade } from '@/styles/animations';

interface ContentContainerProps {
  isRound?: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  ${Fade}
  position: relative;
  display: inline-flex;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  pointer-events: all;

  ${({ isRound }) =>
    isRound
      ? css`
          border-radius: 50%;
        `
      : css`
          border-radius: 5px;
        `}
`;

export default ContentContainer;
