import { styled, transition } from '@/hocs';

import { ITEM_HEIGHT, ITEM_MARGIN_VERTICAL } from './MenuItem';

export type ActiveIndicatorProps = {
  activeIndex: number;
};

const ActiveIndicator = styled.div<ActiveIndicatorProps>`
  ${transition('transform')}
  position: absolute;
  top: 0;
  right: 0;
  width: 2px;
  height: 24px;
  margin: 10px 0;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background-color: #5d9df5;
  will-change: transform;

  transform: translateY(${({ activeIndex }) => activeIndex * (ITEM_HEIGHT + ITEM_MARGIN_VERTICAL * 2) + ITEM_MARGIN_VERTICAL}px);
`;

export default ActiveIndicator;
