import { SectionV2, SvgIcon } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React from 'react';

import UtteranceInput from '@/components/Utterance';
import * as SlotV2 from '@/ducks/slotV2';
import { InjectedDraggableProps, withDraggable } from '@/hocs/withDraggable';
import { useAddSlot, useSelector } from '@/hooks';

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
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const { onAddSlot } = useAddSlot();

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
  canDrag: _constant(true),
  allowXTransform: true,
})(React.memo(UtteranceItem));
