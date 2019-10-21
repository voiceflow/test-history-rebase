import Flex from '@/componentsV2/Flex';
import { css, styled, units } from '@/hocs';

const StepCard = styled(Flex)`
  position: relative;
  margin: ${units(0.5)}px;
  border-radius: ${units(0.5)}px;
  padding: 1.2em 1.5em;
  background: #fff;
  overflow: hidden;
  opacity: 1;
  user-select: none;

  &:focus,
  &:focus-within {
    background: #eff5f7;
  }

  ${({ isDragging }) =>
    isDragging &&
    css`
      opacity: 0;
      cursor: grabbing;
    `}

  ${({ isPreview }) =>
    isPreview &&
    css`
      background: linear-gradient(180deg, rgba(238, 244, 246, 0.3) 0%, rgba(238, 244, 246, 0.45) 100%), rgba(255, 255, 255, 0.9);
      box-shadow: 0px 8px 16px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.06);
    `}
`;

export default StepCard;
