import { Box, SidebarEditor, StrengthGauge } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { DragItem } from '@/hocs/withDraggable';
import { useDragPreview } from '@/hooks';
import { ConflictUtterance, DeletedUtterancePayload, EditUtterancePayload, MoveUtterancePayload, NLUIntent } from '@/pages/NLUManager/types';

import { DragAndDropTypes } from '../constants';
import * as S from '../styles';
import UtteranceItem, { OwnUtteranceProps } from './UtteranceItem';
import UtterancePreview from './UtterancePreview';

interface IntentItemProps {
  intent: NLUIntent;
  conflictID: string;
  utterances: ConflictUtterance[];
  onEditUtterance: (payload: EditUtterancePayload) => void;
  onMoveUtterance: (payload: MoveUtterancePayload) => void;
  onDeleteUtterance: (payload: DeletedUtterancePayload) => void;
}

const IntentItem: React.FC<IntentItemProps> = ({ intent, conflictID, utterances, onEditUtterance, onDeleteUtterance, onMoveUtterance }) => {
  const intentUtterances = React.useMemo(() => utterances.filter((u) => !u.deleted), [utterances]);
  const intentName = intent?.name || '';
  const intentID = intent?.id || '';

  const onMove = (from: DragItem<OwnUtteranceProps>, to: DragItem<OwnUtteranceProps>) => {
    onMoveUtterance({
      to: { index: to.index, intentID: to.intentID, utterance: to.text },
      from: { index: from.index, intentID: from.intentID, utterance: from.text },
      utterance: from.text,
      conflictID,
    });
  };

  useDragPreview(DragAndDropTypes.UTTERANCE, (props: any) => <UtterancePreview text={props.text} utteranceWidth={props._width} />, {
    horizontalEnabled: true,
  });

  const [, connectDrop] = useDrop({
    hover: _throttle((item) => {
      if (intentUtterances.length > 0) return;

      onMoveUtterance({
        conflictID,
        utterance: item.text,
        from: {
          intentID: item.listId,
          index: item.index,
          utterance: item.text,
        },
        to: {
          intentID,
          index: 0,
          utterance: item.text,
        },
      });
    }, HOVER_THROTTLE_TIMEOUT),
    accept: DragAndDropTypes.UTTERANCE,
  });

  return (
    <S.IntentItem ref={connectDrop}>
      <SidebarEditor.HeaderTitle fontWeight={600} fontSize={15} marginBottom={16}>
        {intentName}

        <Box marginLeft={16} display="inline-block" position="relative" bottom="3px">
          <StrengthGauge width={40} level={intent?.clarityLevel} />
        </Box>
      </SidebarEditor.HeaderTitle>

      <div style={{ display: 'grid', gridGap: '16px' }}>
        {intentUtterances.map((utterance, index) => (
          <UtteranceItem
            id={utterance.sentence}
            key={index}
            text={utterance.sentence}
            index={index}
            onMove={onMove}
            listID={intentID}
            onEdit={(text) => onEditUtterance({ conflictID, intentID, newUtteranceSentence: text, utterance: utterance.sentence })}
            onRemove={() => onDeleteUtterance({ conflictID, utterance })}
            intentID={intentID}
          />
        ))}
      </div>
    </S.IntentItem>
  );
};

export default IntentItem;
