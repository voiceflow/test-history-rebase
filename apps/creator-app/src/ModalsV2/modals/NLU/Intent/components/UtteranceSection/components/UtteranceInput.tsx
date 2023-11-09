import composeRef from '@seznam/compose-react-refs';
import { Entity } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Badge, ErrorMessage, SvgIcon } from '@voiceflow/ui';
import { EditorState } from 'draft-js';
import React from 'react';

import type { VariablesPluginsData } from '@/components/TextEditor/types';
import Utterance, { UtteranceRef } from '@/components/Utterance';

interface UtteranceInputProps {
  onAdd: (slot: Platform.Base.Models.Intent.Input) => void;
  slots: Array<Realtime.Slot | Entity>;
  value?: Platform.Base.Models.Intent.Input | null;
  isEmpty: boolean;
  onChange: (slot: Platform.Base.Models.Intent.Input) => void;
  readOnly?: boolean;
  addError?: string;
  onAddSlot: VariablesPluginsData['onAddVariable'];
  updateIsEmpty: (val: boolean) => void;
  isValidUtterance: boolean;
  setValidUtterance: () => void;
}

const UtteranceInput: React.ForwardRefRenderFunction<UtteranceRef, UtteranceInputProps> = (
  { onChange, isValidUtterance, onAdd, readOnly, onAddSlot, updateIsEmpty, addError, isEmpty, value, slots, setValidUtterance },
  ref
) => {
  const utteranceRef = React.useRef<UtteranceRef>(null);

  const onEditorStateChange = (state: EditorState) => {
    const isEmpty = !state.getCurrentContent().hasText();
    if (isEmpty) setValidUtterance();
  };

  return (
    <>
      <Utterance
        ref={composeRef(ref, utteranceRef)}
        space
        slots={slots}
        value={value?.text || ''}
        onBlur={onChange}
        error={!isValidUtterance}
        onEmpty={updateIsEmpty}
        readOnly={readOnly}
        onAddSlot={onAddSlot}
        iconProps={{ variant: SvgIcon.Variant.BLUE }}
        placeholder="Add sample phrase, { to add entities"
        onEnterPress={onAdd}
        onEditorStateChange={onEditorStateChange}
        rightAction={
          !isEmpty && (
            <Badge slide onClick={() => utteranceRef.current && onAdd(utteranceRef.current.getCurrentUtterance())}>
              Enter
            </Badge>
          )
        }
      />

      {!isValidUtterance && <ErrorMessage mb={0}>{addError}</ErrorMessage>}
    </>
  );
};

export default React.forwardRef(UtteranceInput);
