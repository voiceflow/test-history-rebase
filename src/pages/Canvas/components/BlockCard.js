import { FloatingCard } from '@/componentsV2/Card';
import { flexCenterStyles } from '@/componentsV2/Flex';
import { css, styled, transition, units } from '@/hocs';

const BlockCard = styled(FloatingCard)`
  ${flexCenterStyles}

  position: absolute;
  min-width: 140px;
  flex-direction: column;
  padding: ${units()}px 0;
  ${transition()}
  transform: translateX(-50%);
  box-sizing: content-box;

  &:hover,
  &:active {
    box-shadow: rgba(98, 119, 140, 0.15) 0px 0px 0.1pt 1pt, #3676a547 0px 4px 10px;
  }

  ${({ isActive }) =>
    isActive
      ? css`
          box-shadow: rgba(98, 119, 140, 0.19) 0px 0px 0.1pt 1pt, 0 12px 32px #3676a547 !important;
        `
      : css`
          box-shadow: rgba(98, 119, 140, 0.19) 0px 0px 0pt 1pt;
        `};
`;

export default BlockCard;
