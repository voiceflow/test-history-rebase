import { FlexCenter } from '@/componentsV2/Flex';
import { css, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

const UpdateBubble = styled(FlexCenter)`
  position: absolute;
  top: -2px;
  right: -1px;
  z-index: 3;
  box-sizing: content-box;
  width: 9px;
  height: 9px;
  background-color: #293450;
  border: 4px solid #fff;
  border-radius: 100%;
  color: #fff;
  cursor: pointer;
  transition: height ${ANIMATION_SPEED}s ease, width ${ANIMATION_SPEED}s ease;

  & > span {
    display: none;
    transition: all 0.15s ease;
  }

  ${({ expand }) =>
    expand &&
    css`
      border: 4px solid #fff;
      width: 30px;
      height: 30px;
      top: 2px;
      right: 2px;

      & > span {
        display: block;
      }
    `}
`;

export default UpdateBubble;
