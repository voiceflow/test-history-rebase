import { Box, SidebarEditor, StrengthGauge } from '@voiceflow/ui';
import _throttle from 'lodash/throttle';
import React from 'react';
import { useDrop } from 'react-dnd';

import { HOVER_THROTTLE_TIMEOUT } from '@/constants';
import { useDragPreview } from '@/hooks';
import { ConflictUtterance, DeletedUtterancePayload, EditUtterancePayload, MoveUtterancePayload, NLUIntent } from '@/pages/NLUManager/types';

import { DragAndDropTypes } from '../constants';
import * as S from '../styles';
import UtteranceItem from './UtteranceItem';
import UtterancePreview from './UtterancePreview';

interface IntentItemProps {
  intent: NLUIntent;
  conflictID: string;
  utterances: ConflictUtterance[];
  onDeleteUtterance: (payload: DeletedUtterancePayload) => void;
  onEditUtterance: (payload: EditUtterancePayload) => void;
  onMoveUtterance: (payload: MoveUtterancePayload) => void;
}

const IntentItem: React.FC<IntentItemProps> = ({ intent, conflictID, utterances, onEditUtterance, onDeleteUtterance, onMoveUtterance }) => {
  const intentUtterances = React.useMemo(() => utterances.filter((u) => !u.deleted), [utterances]);
  const intentName = intent?.name || '';
  const intentID = intent?.id || '';

  const onMove = (from: any, to: any) => {
    onMoveUtterance({
      conflictID,
      utterance: from.text,
      from: {
        intentID: from.listId,
        index: from.index,
        utterance: from.text,
      },
      to: {
        intentID: to.listId,
        index: to.index,
        utterance: to.text,
      },
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
            text={utterance.sentence}
            key={index}
            onRemove={() => onDeleteUtterance({ conflictID, utterance })}
            onEdit={(text) => onEditUtterance({ conflictID, intentID, newUtteranceSentence: text, utterance: utterance.sentence })}
            intentID={intentID}
            id={utterance.sentence}
            index={index}
            onMove={onMove}
            listId={intentID}
          />
        ))}
      </div>
    </S.IntentItem>
  );
};

export default IntentItem;
