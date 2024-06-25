import { Flex } from '@voiceflow/ui';

import { CANVAS_INTERACTING_CLASSNAME } from '@/components/Canvas/constants';
import { css, keyframes, styled, transition } from '@/hocs/styled';
import { CANVAS_DRAGGING_CLASSNAME, CANVAS_MERGING_CLASSNAME } from '@/pages/Canvas/constants';

import { INDICATOR_DIAMETER } from '../constants';

const ScaleInKeyframes = keyframes`
  from {
    transform: translate(-50%, -50%) scale(0)
  }

  to {
    transform: translate(-50%, -50%) scale(1);
  }
`;

const CommentIndicator = styled(Flex)<{ isFocused?: boolean }>`
  animation: ${ScaleInKeyframes} 60ms ease-in-out;
  position: absolute;
  justify-content: center;
  width: ${INDICATOR_DIAMETER}px;
  height: ${INDICATOR_DIAMETER}px;
  border: solid 1px #5d9df5;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(19, 33, 68, 0.08);
  background-image: radial-gradient(circle, transparent 90%, #fff 10%),
    linear-gradient(to bottom, rgba(93, 157, 245, 0.85) 3%, #5d9df5 98%);
  color: #fff;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transform: translate(-50%, -50%) scale(1);
  ${transition('transform')};

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

  .${CANVAS_DRAGGING_CLASSNAME} &,
  .${CANVAS_MERGING_CLASSNAME} & {
    visibility: hidden;
  }
`;

export default CommentIndicator;
