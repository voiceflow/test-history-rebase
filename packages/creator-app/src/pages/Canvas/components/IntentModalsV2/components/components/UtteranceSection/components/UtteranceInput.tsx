import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ErrorMessage } from '@voiceflow/ui';
import { EditorState } from 'draft-js';
import React from 'react';

import Utterance from '@/components/Utterance';

import { UtteranceRef } from '../index';

interface UtteranceInputProps {
  intentUtterances: Realtime.IntentInput[];
  setValidUtterance: () => void;
  slots: Realtime.Slot[];
  value?: Realtime.IntentInput | null;
  updateIsEmpty: (val: boolean) => void;
  isEmpty: boolean;
  isNotAtTop: boolean;
  addError?: string;
  onAddSlot: (name: string) => Promise<Realtime.Slot | null>;
  onAdd: (slot: Realtime.IntentInput) => void;
  isValidUtterance: boolean;
  onChange: (slot: Realtime.IntentInput) => void;
}

const UtteranceInput: React.ForwardRefRenderFunction<UtteranceRef, UtteranceInputProps> = (
  { onChange, isValidUtterance, onAdd, onAddSlot, updateIsEmpty, addError, isNotAtTop, isEmpty, value, slots, intentUtterances, setValidUtterance },
  ref
) => (
  <Box mb={intentUtterances.length ? -21 : -4} mt={-1} pt={1} px={32} top={58} zIndex={1000} position="sticky" backgroundColor="white">
    <Utterance
      onEditorStateChange={(state: EditorState) => {
        const isEmpty = !state.getCurrentContent().hasText();
        if (isEmpty) setValidUtterance();
      }}
      ref={ref}
      space
      slots={slots}
      value={value?.text || ''}
      onBlur={onChange}
      onEmpty={updateIsEmpty}
      onAddSlot={onAddSlot}
      iconProps={{ variant: 'blue' }}
      rightAction={
        !isEmpty && (
          <Badge
            slide
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const utterance = ref?.current.getCurrentUtterance();
              !!utterance && onAdd(utterance);
            }}
          >
            Enter
          </Badge>
        )
      }
      placeholder="Add sample phrase, { to add entities"
      onEnterPress={onAdd}
      error={!isValidUtterance}
    />
    {!isValidUtterance && <ErrorMessage noMarginBottom={!intentUtterances.length}>{addError}</ErrorMessage>}
    {!!intentUtterances.length && <hr style={!isNotAtTop ? { marginLeft: '-32px' } : undefined} />}
  </Box>
);

export default React.forwardRef(UtteranceInput);
