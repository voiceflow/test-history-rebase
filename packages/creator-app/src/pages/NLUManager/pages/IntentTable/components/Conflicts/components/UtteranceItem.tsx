import { Input, SectionV2, SvgIcon } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import { InjectedDraggableComponentProps, withDraggable } from '@/hocs';

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
  const item = (
    <div>
      <S.UtteranceListItemContainer isDragging={!!isDragging}>
        <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
          <S.DragIconContainer>
            <SvgIcon size={14} icon="dotsGroup" color="#becedc" />
          </S.DragIconContainer>

          <Input value={text} onChangeText={onEdit} />
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
