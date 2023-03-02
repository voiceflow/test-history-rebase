import { Box, SidebarEditor, StrengthGauge, usePersistFunction } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import * as Normal from 'normal-store';
import React from 'react';
import { useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { DragItem } from '@/hocs/withDraggable';
import { ConflictUtterance, DeletedUtterancePayload, EditUtterancePayload, MoveUtterancePayload, NLUIntent } from '@/pages/NLUManager/types';

import { DragAndDropTypes } from '../constants';
import * as S from '../styles';
import UtteranceItem, { OwnUtteranceProps } from './UtteranceItem';

interface IntentItemProps {
  intent: NLUIntent;
  conflictID: string;
  utterances: Normal.Normalized<ConflictUtterance> | null;
  onEditUtterance: (payload: EditUtterancePayload) => void;
  onMoveUtterance: (payload: MoveUtterancePayload) => void;
  onDeleteUtterance: (payload: DeletedUtterancePayload) => void;
}

const IntentItem: React.FC<IntentItemProps> = ({ intent, conflictID, utterances, onEditUtterance, onDeleteUtterance, onMoveUtterance }) => {
  const intentUtterances = React.useMemo(() => (utterances ? Normal.denormalize(utterances).filter(({ deleted }) => !deleted) : []), [utterances]);

  const onMove = usePersistFunction((from: DragItem<OwnUtteranceProps>, to: DragItem<OwnUtteranceProps>) => {
    if (!to.listID || !from.listID) return;

    onMoveUtterance({
      to: { index: to.index, intentID: to.listID },
      from: { intentID: from.listID, utteranceID: from.id },
      conflictID,
    });
  });

  const onEdit = usePersistFunction((utteranceID: string, sentence: string) =>
    onEditUtterance({
      intentID: intent.id,
      sentence,
      conflictID,
      utteranceID,
    })
  );

  const onRemove = usePersistFunction((utteranceID: string) =>
    onDeleteUtterance({
      intentID: intent.id,
      conflictID,
      utteranceID,
    })
  );

  const [, connectDrop] = useDrop({
    accept: DragAndDropTypes.UTTERANCE,
    hover: _throttle((item: DragItem<ConflictUtterance>) => {
      if (intentUtterances.length > 0 || !item.listID) return;

      onMoveUtterance({
        to: { index: 0, intentID: intent.id },
        from: { intentID: item.listID, utteranceID: item.id },
        conflictID,
      });

      item.index = 0;
      item.listID = intent.id;
    }, HOVER_THROTTLE_TIMEOUT),
  });

  return (
    <S.IntentItem ref={connectDrop}>
      <SidebarEditor.HeaderTitle fontWeight={600} fontSize={15} marginBottom={16}>
        {intent.name}

        <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
          <StrengthGauge width={40} level={intent.clarityLevel} />
        </Box>
      </SidebarEditor.HeaderTitle>

      <Box display="grid" style={{ gridGap: '16px' }}>
        {intentUtterances.map((utterance, index) => (
          <UtteranceItem
            id={utterance.id}
            key={utterance.id}
            index={index}
            onMove={onMove}
            listID={intent.id}
            onEdit={onEdit}
            sentence={utterance.sentence}
            onRemove={onRemove}
          />
        ))}
      </Box>
    </S.IntentItem>
  );
};

export default React.memo(IntentItem);
