import { SectionV2, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import UtteranceInput from '@/components/Utterance';
import * as Tracking from '@/ducks/tracking';
import { InjectedDraggableProps, withDraggable } from '@/hocs/withDraggable';
import { useAllEntitiesSelector, useOnOpenEntityCreateModal } from '@/hooks/entity.hook';

import { DragAndDropTypes } from '../constants';
import * as S from '../styles';

export interface OwnUtteranceProps {
  id: string;
  onEdit: (id: string, sentence: string) => void;
  onRemove: (id: string) => void;
  sentence: string;
}

interface UtteranceItemProps extends InjectedDraggableProps, OwnUtteranceProps {}

const UtteranceItem: React.FC<UtteranceItemProps> = ({ id, onEdit, onRemove, sentence, isDragging, connectedRootRef }) => {
  const allSlots = useAllEntitiesSelector();
  const onOpenEntityCreateModal = useOnOpenEntityCreateModal();

  const onAddSlot = async (name: string) => {
    try {
      return await onOpenEntityCreateModal({ name, folderID: null, creationType: Tracking.CanvasCreationType.NLU_MANAGER });
    } catch {
      return null;
    }
  };

  return (
    <div ref={connectedRootRef}>
      <S.UtteranceListItemContainer isDragging={isDragging}>
        <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={() => onRemove(id)} />}>
          <S.DragIconContainer>
            <SvgIcon size={14} icon="dotsGroup" color="#becedc" />
          </S.DragIconContainer>

          <UtteranceInput
            space
            slots={allSlots}
            value={sentence}
            onBlur={({ text }) => onEdit(id, text)}
            readOnly={isDragging}
            onAddSlot={onAddSlot}
            onEnterPress={({ text }) => onEdit(id, text)}
          />
        </SectionV2.ListItem>
      </S.UtteranceListItemContainer>
    </div>
  );
};

export default withDraggable<OwnUtteranceProps>({
  name: DragAndDropTypes.UTTERANCE,
  canDrag: true,
  allowXTransform: true,
})(React.memo(UtteranceItem));
