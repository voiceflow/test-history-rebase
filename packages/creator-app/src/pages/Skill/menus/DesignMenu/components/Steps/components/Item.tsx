import cn from 'classnames';
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import { BlockType, DragItem } from '@/constants';
import { useEnableDisable, useEventualEngine, useSetup } from '@/hooks';
import { NodeData } from '@/models';
import { ClassName } from '@/styles/constants';

import { StepDragItem } from '../types';
import ItemContainer from './ItemContainer';
import ItemDotsIconContainer from './ItemDotsIconContainer';
import ItemLabel from './ItemLabel';

export type ItemProps = {
  type: BlockType;
  icon: Icon | React.FC;
  label: string;
  factoryData?: Partial<NodeData<unknown>>;
  iconColor?: string;
  isDraggingPreview?: boolean;
};

const Item: React.FC<ItemProps> = ({ icon, type, label, iconColor, factoryData, isDraggingPreview }) => {
  const engine = useEventualEngine();
  const [isClickedState, enableClickedState, clearClickedState] = useEnableDisable();

  const [{ isDragging }, connectDrag, connectPreview] = useDrag<StepDragItem, unknown, { isDragging: boolean }>({
    item: { type: DragItem.BLOCK_MENU, icon, label, iconColor, blockType: type, factoryData },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    begin: () => {
      engine()?.merge.setVirtualSource(type, factoryData);
    },
    end: () => {
      engine()?.merge.reset();
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
