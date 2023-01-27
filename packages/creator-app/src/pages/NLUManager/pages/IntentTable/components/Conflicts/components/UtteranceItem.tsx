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
  text: string;
  onEdit: (text: string) => void;
  onRemove: () => void;
  intentID: string;
}

interface UtteranceItemProps extends InjectedDraggableProps, OwnUtteranceProps {}

const UtteranceItem: React.FC<UtteranceItemProps> = ({ text, onRemove, onEdit, isDragging, connectedRootRef }) => {
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const { onAddSlot } = useAddSlot();

  return (
    <div ref={connectedRootRef}>
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
};

export default withDraggable<OwnUtteranceProps>({
  name: DragAndDropTypes.UTTERANCE,
  canDrag: _constant(true),
  canDrop: _constant(true),
  allowXTransform: true,
})(React.memo(UtteranceItem));
