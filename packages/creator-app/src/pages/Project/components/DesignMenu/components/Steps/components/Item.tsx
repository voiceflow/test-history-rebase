import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, SvgIcon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import { BlockType, DragItem } from '@/constants';
import { AutoPanningCacheContext } from '@/contexts';
import { useEnableDisable, useEventualEngine, useSetup } from '@/hooks';
import { ClassName } from '@/styles/constants';

import { StepDragItem } from '../types';
import ItemContainer from './ItemContainer';
import ItemDotsIconContainer from './ItemDotsIconContainer';
import ItemLabel from './ItemLabel';
import StepIcon from './StepIcon';

export interface ItemProps {
  type: BlockType;
  icon: Icon | React.FC;
  label: string;
  factoryData?: Partial<Realtime.NodeData<unknown>>;
  isDraggingPreview?: boolean;
}

const Item: React.FC<ItemProps> = ({ icon, type, label, factoryData, isDraggingPreview }) => {
  const engine = useEventualEngine();
  const isAutoPanning = React.useContext(AutoPanningCacheContext);
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<StepDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.BLOCK_MENU, icon, label, blockType: type, factoryData },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    begin: () => {
      engine()?.merge.setVirtualSource(type, factoryData);
      engine()?.drag.setDraggingToCreate(true);
    },
    end: () => {
      isAutoPanning.current = false;
      engine()?.merge.reset();
      engine()?.drag.setDraggingToCreate(false);
    },
  });

  useSetup(() => {
    connectPreview(getEmptyImage(), { captureDraggingState: true });
  });

  React.useEffect(
    () => () => {
      connectDrag(null);
    },
    [connectDrag]
  );

  React.useEffect(() => {
    if (isDragging) {
      clearClickedState();
    }
  }, [isDragging]);

  return (
    <ItemContainer
      isClicked={isClickedState}
      onMouseUp={clearClickedState}
      onMouseDown={enableClickedState}
      className={cn(ClassName.STEP_MENU_ITEM, `${ClassName.STEP_MENU_ITEM}--${type}`)}
      ref={connectDrag}
      isDragging={isDragging}
      isDraggingPreview={isDraggingPreview}
    >
      {!isDragging && (
        <>
          <StepIcon icon={icon} size={16} />

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
