import { CANVAS_INTERACTING_CLASSNAME } from '@/components/Canvas/constants';
import Flex from '@/components/Flex';
import { css, styled } from '@/hocs';

import { INDICATOR_DIAMETER } from '../constants';

const CommentIndicator = styled(Flex)<{ isFocused?: boolean }>`
  position: absolute;
  transform: translate(-50%, -50%) scale(1);
  transition: all 0.3s ease-in-out;
  justify-content: center;
  width: ${INDICATOR_DIAMETER}px;
  height: ${INDICATOR_DIAMETER}px;
  border: solid 1px #5d9df5;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(19, 33, 68, 0.08);
  background-image: radial-gradient(circle, transparent 90%, #fff 10%), linear-gradient(to bottom, rgba(93, 157, 245, 0.85) 3%, #5d9df5 98%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  :before {
    content: '';
    z-index: -1;
    border-radius: 50%;
    border: 1px solid #fff;
    width: 100%;
    position: absolute;
    height: 100%;
  }

  :hover {
    transform: translate(-50%, -50%) scale(1.2);

    ${({ isFocused }) =>
      isFocused &&
      css`
        transform: translate(-50%, -50%) scale(1, 1);
      `}
  }

  .${CANVAS_INTERACTING_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default CommentIndicator;
