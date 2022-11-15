import composeRef from '@seznam/compose-react-refs';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, Box, ErrorMessage, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Utterance, { UtteranceRef } from '@/components/Utterance';

interface UtteranceInputProps {
  intentUtterances: Platform.Base.Models.Intent.Input[];
  setValidUtterance: () => void;
  slots: Realtime.Slot[];
  value?: Platform.Base.Models.Intent.Input | null;
  updateIsEmpty: (val: boolean) => void;
  isEmpty: boolean;
  isNotAtTop: boolean;
  addError?: string;
  onAddSlot: (name: string) => Promise<Realtime.Slot | null>;
  onAdd: (slot: Platform.Base.Models.Intent.Input) => void;
  isValidUtterance: boolean;
  onChange: (slot: Platform.Base.Models.Intent.Input) => void;
}

const UtteranceInput: React.ForwardRefRenderFunction<UtteranceRef, UtteranceInputProps> = (
  { onChange, isValidUtterance, onAdd, onAddSlot, updateIsEmpty, addError, isNotAtTop, isEmpty, value, slots, intentUtterances, setValidUtterance },
  ref
) => {
  const utteranceRef = React.useRef<UtteranceRef>(null);

  return (
    <Box mb={intentUtterances.length ? -21 : -4} mt={-1} pt={1} px={32} top={58} zIndex={1000} position="sticky" backgroundColor="white">
      <Utterance
        onEditorStateChange={(state) => {
          const isEmpty = !state.getCurrentContent().hasText();
          if (isEmpty) setValidUtterance();
        }}
        ref={composeRef(ref, utteranceRef)}
        space
        slots={slots}
        value={value?.text || ''}
        onBlur={onChange}
        onEmpty={updateIsEmpty}
        onAddSlot={onAddSlot}
        iconProps={{ variant: SvgIcon.Variant.BLUE }}
        rightAction={
          !isEmpty && (
            <Badge slide onClick={() => utteranceRef.current && onAdd(utteranceRef.current.getCurrentUtterance())}>
              Enter
            </Badge>
          )
        }
        placeholder="Add sample phrase, { to add entities"
        onEnterPress={onAdd}
        error={!isValidUtterance}
      />
      {!isValidUtterance && <ErrorMessage mb={!intentUtterances.length ? 0 : undefined}>{addError}</ErrorMessage>}
      {!!intentUtterances.length && <hr style={!isNotAtTop ? { marginLeft: '-32px' } : undefined} />}
    </Box>
  );
};

export default React.forwardRef(UtteranceInput);
