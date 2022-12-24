import { SectionV2, SvgIcon } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import UtteranceInput from '@/components/Utterance';
import * as SlotV2 from '@/ducks/slotV2';
import { InjectedDraggableComponentProps, withDraggable } from '@/hocs/withDraggable';
import { useAddSlot, useSelector } from '@/hooks';

import { DragAndDropTypes } from '../constants';
import * as S from '../styles';

interface UtteranceItemProps extends InjectedDraggableComponentProps {
  text: string;
  intentID: string;
  onRemove: () => void;
  onEdit: (text: string) => void;
  isDragging?: boolean;
  isDraggingPreview?: boolean;
}

const UtteranceItem: React.FC<UtteranceItemProps> = ({ text, onRemove, onEdit, isDragging, connectDragSource, connectDropTarget }) => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const { onAddSlot } = useAddSlot();

  const item = (
    <div>
      <S.UtteranceListItemContainer isDragging={!!isDragging}>
        <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
          <S.DragIconContainer>
            <SvgIcon size={14} icon="dotsGroup" color="#becedc" />
          </S.DragIconContainer>

          <UtteranceInput
            space
            slots={allSlots}
            value={text}
            onBlur={(data) => onEdit(data.text)}
            onEnterPress={(data) => onEdit(data.text)}
            onAddSlot={onAddSlot}
          />
        </SectionV2.ListItem>
      </S.UtteranceListItemContainer>
    </div>
  );

  return connectDragSource && connectDropTarget ? connectDragSource(connectDropTarget(item)) : item;
};

export default withDraggable({
  name: DragAndDropTypes.UTTERANCE,
  canDrag: _constant(true),
  canDrop: _constant(true),
  onDropKey: 'onDrop',
  onMoveKey: 'onMove',
  allowXTransform: true,
})<UtteranceItemProps>(React.memo(UtteranceItem));
