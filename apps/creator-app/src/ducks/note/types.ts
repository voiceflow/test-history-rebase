import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

export interface NoteRootState extends Normal.Normalized<Realtime.Note> {}
