import { SvgIconContainer } from '@/components/SvgIcon';
import Card from '@/componentsV2/Card';
import { flexStyles } from '@/componentsV2/Flex';
import { css, styled, units } from '@/hocs';

import MenuTooltipContainer from './MenuTooltipContainer';

const BlockMenuItemCard = styled(Card)`
  ${flexStyles}

  padding: ${units(1.5)}px ${units(2)}px;
  color: #132144;
  background: linear-gradient(-180deg,rgba(238,244,246,.3),rgba(238,244,246,.45));
  transition: all 0.15s ease;
  border: 1px solid #eaeff4;
  border-radius: 5px;

  ${({ isEnabled }) =>
    !isEnabled &&
    css`
      opacity: 0.5;
    `}

  &:hover {
    color: #0b1a38;
    background: #fff;
    border-color: transparent;
    box-shadow: 0 0 1px 1px rgba(17,49,96,.06),0 2px 4px 0 rgba(17,49,96,.12);
    transform: translateY(-1px);
    cursor: grab;
  }
  
  &:active {
    cursor: grabbing;
  }

  & ${SvgIconContainer} {
      color: #BECEDC;
      margin-right: ${units(1.5)}px;
  }
  
  & ${MenuTooltipContainer} {
    display: none;
  }
  
  &:hover ${MenuTooltipContainer} {
    display: flex;
  }
`;

export default BlockMenuItemCard;
