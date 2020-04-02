import { dragPlaceholderStyles } from '@/components/DragPlaceholder';
import Flex from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

import ItemDotsIconContainer from './ItemDotsIconContainer';

const ItemContainer = styled(Flex)`
  width: 200px;
  margin: 0 1px;
  height: 45px;
  padding: 0 16px;
  margin-bottom: 10px;
  
  position: relative;

  border-radius: 5px;
  background-color: #fff;
  
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.12), 0 0 0 1px rgba(17, 49, 96, 0.04);
  cursor: grab;
  ${transition('background-image', 'box-shadow', 'transform')}

  ${({ isDragging }) =>
    isDragging &&
    css`
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.1) !important;
      cursor: grabbing;
      ${dragPlaceholderStyles}
    `}

  ${({ isDraggingPreview }) =>
    isDraggingPreview &&
    css`
      transform: rotate(-2deg);
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
      background-image: linear-gradient(to bottom, rgba(238, 244, 246, 0.3), rgba(238, 244, 246, 0.6)), linear-gradient(to bottom, #ffffff, #ffffff);
      cursor: grabbing;
    `}

  ${ItemDotsIconContainer} {
    opacity: 0;
    ${transition('opacity')}
  }
  
  &:hover {
    box-shadow: 0 2px 3px 0 rgba(17,49,96,0.12), 0 0 0 1px rgba(17,49,96,0.04);
    
    ${ItemDotsIconContainer} {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
  }
`;

export default ItemContainer;
