import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import SvgIcon from '@/components/SvgIcon';
import { DragItem } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { useSetup } from '@/hooks';
import { ClassName } from '@/styles/constants';

import ItemContainer from './ItemContainer';
import ItemDotsIconContainer from './ItemDotsIconContainer';
import ItemLabel from './ItemLabel';

const Item = ({ icon, type, label, iconColor, factoryData, isDraggingPreview }) => {
  const eventualEngine = React.useContext(EventualEngineContext);
  const [{ isDragging }, connectDrag, connectPreview] = useDrag({
    item: { type: DragItem.BLOCK_MENU, icon, label, iconColor, blockType: type, factoryData },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    begin: () => {
      eventualEngine.get()?.merge.setVirtualSource(type, factoryData);
    },
    end: () => {
      eventualEngine.get()?.merge.reset();
    },
  });

  useSetup(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  });

  return (
    <ItemContainer className={ClassName.STEP_MENU_ITEM} ref={connectDrag} isDragging={isDragging} isDraggingPreview={isDraggingPreview}>
      {!isDragging && (
        <>
          <SvgIcon icon={icon} size={16} color={iconColor} />

          <ItemLabel>{label}</ItemLabel>

          <ItemDotsIconContainer>
            <SvgIcon size={14} icon="dotsGroup" color="#becedc" />
          </ItemDotsIconContainer>
        </>
      )}
    </ItemContainer>
  );
};
export default React.memo(Item);
