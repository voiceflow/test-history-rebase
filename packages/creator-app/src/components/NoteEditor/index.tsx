import { AnyRecord } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import MentionEditor, { MentionEditorProps } from '@/components/MentionEditor';
import * as Note from '@/ducks/note';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useLinkedState, useSelector, useTrackingEvents } from '@/hooks';

interface NoteEditorProps<T extends Realtime.Note> extends Omit<MentionEditorProps, 'meta' | 'value' | 'onBlur' | 'onChange'> {
  id?: string;
  type: T['type'];
  creationType: Tracking.IntentEditType;
  onUpsert: (note: T) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

const DEFAULT_MENTIONS: number[] = [];

const NoteEditor = <T extends Realtime.Note>({
  id,
  creationType,
  type,
  meta,
  onUpsert,
  inputRef,
  ...props
}: T['meta'] extends AnyRecord ? NoteEditorProps<T> & { meta: T['meta'] } : NoteEditorProps<T> & { meta?: T['meta'] }): React.ReactElement => {
  const note = useSelector(Note.noteByIDSelector, { id });

  const [trackingEvents] = useTrackingEvents();

  const [value, setValue] = useLinkedState(note?.text ?? '');
  const [mentions, setMentions] = useLinkedState(note?.mentions ?? DEFAULT_MENTIONS);

  const upsertNote = useDispatch(Note.upsertNote);

  const onChange = (text: string, newMentions: number[]) => {
    setValue(text);
    setMentions(newMentions);
    trackingEvents.trackIntentEdit({ creationType });
  };

  const onBlur = async () => {
    const newNote: Realtime.Note = {
      id: note?.id ?? Utils.id.cuid(),
      type: note?.type ?? type,
      text: value,
      meta,
      mentions,
    };

    await upsertNote(newNote);
    onUpsert(newNote as T);
  };

  return <MentionEditor {...props} value={value} onBlur={onBlur} onChange={onChange} inputRef={inputRef} />;
};

export default NoteEditor;
