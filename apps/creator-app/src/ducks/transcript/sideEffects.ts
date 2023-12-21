import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import Bowser from 'bowser';

import client from '@/client';
import { TranscriptExportFormat } from '@/client/transcript';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { patchTranscript, replaceTranscripts, updateUnreadTranscripts } from '@/ducks/transcript/actions';
import { transcriptByIDSelector } from '@/ducks/transcript/selectors';
import { Sentiment, SystemTag, Transcript } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { downloadBlob } from '@/utils/download.util';

export const fetchTranscripts =
  (queryParams?: string): Thunk<Transcript[]> =>
  async (dispatch, getState) => {
    const state = getState();
    try {
      const activeProjectID = Session.activeProjectIDSelector(state);

      const transcripts = await client.transcript.find(activeProjectID!, queryParams);

      dispatch(replaceTranscripts({ values: transcripts }));

      return transcripts;
    } catch (e) {
      toast.error('Error fetching transcripts');
    }
    return [];
  };

export const resetTranscripts = (): SyncThunk => async (dispatch) => dispatch(replaceTranscripts({ values: [] }));

export const setUtteranceAddedTo =
  (newUtteranceCount: number, intentName: string, intentID: string, transcriptID: string, turnID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    try {
      const activeProjectID = Session.activeProjectIDSelector(state);

      await client.transcript.setTurnUtteranceAddedTo(transcriptID, activeProjectID!, turnID, intentID, newUtteranceCount);

      const transcript = transcriptByIDSelector(state, { id: transcriptID });

      dispatch(
        patchTranscript({
          key: transcriptID,
          value: {
            annotations: {
              ...transcript?.annotations,
              [turnID]: {
                ...transcript?.annotations?.[turnID],
                utteranceAddedTo: intentID,
                utteranceAddedCount: newUtteranceCount,
              },
            },
          },
        })
      );

      toast.success(`${newUtteranceCount} utterance(s) added to the ${intentName} intent`);
    } catch (e) {
      toast.error('Error saving');
    }
  };

export interface CreateTranscriptOptions {
  persona?: Transcript['persona'];
}

export const createTranscript =
  ({ persona }: CreateTranscriptOptions = {}): Thunk<string> =>
  async (_dispatch, getState) => {
    const state = getState();
    const { browser, os, platform } = Bowser.parse(window.navigator.userAgent);

    const versionID = Session.activeVersionIDSelector(state);
    // unique identifier for session analytics
    const sessionID = Prototype.prototypeSessionIDSelector(state);
    const activeProjectID = Session.activeProjectIDSelector(state);

    const snapshot = persona ? { ...persona } : undefined;

    if (snapshot && 'projectID' in snapshot) delete snapshot.projectID;

    const { _id } = await client.transcript.createTranscript({
      os: os.name,
      unread: true,
      device: platform.type,
      browser: browser.name,
      persona: snapshot,
      sessionID,
      versionID,
      projectID: activeProjectID ?? undefined,
    });

    return _id;
  };

export const addTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state)!;

    const transcript = transcriptByIDSelector(state, { id: transcriptID });
    const newTagsArray = [...new Set([...(transcript?.reportTags ?? []), tagID])];

    try {
      dispatch(patchTranscript({ key: transcriptID, value: { reportTags: newTagsArray } }));

      await client.transcript.addTag(activeProjectID, transcriptID, tagID);
    } catch (e) {
      toast.error('Error adding tag');

      dispatch(patchTranscript({ key: transcriptID, value: { reportTags: transcript?.reportTags ?? [] } }));
    }
  };

export const removeTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    const transcript = transcriptByIDSelector(state, { id: transcriptID });
    const newTagsArray = [...new Set(transcript?.reportTags ?? [])].filter((tagId) => tagId !== tagID);

    try {
      dispatch(patchTranscript({ key: transcriptID, value: { reportTags: newTagsArray } }));

      await client.transcript.removeTag(activeProjectID!, transcriptID, tagID);
    } catch (e) {
      toast.error('Error removing tag');

      dispatch(patchTranscript({ key: transcriptID, value: { reportTags: transcript?.reportTags ?? [] } }));
    }
  };

export const updateTags =
  (transcriptID: string, tags: string[]): Thunk =>
  async (dispatch) => {
    const updatedTagsArray = [...new Set([...tags])];

    dispatch(patchTranscript({ key: transcriptID, value: { reportTags: updatedTagsArray } }));
  };

export const markAsRead =
  (transcriptID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    try {
      await client.transcript.patchTranscript(activeProjectID!, transcriptID, { unread: false });

      dispatch(patchTranscript({ key: transcriptID, value: { unread: false } }));
    } catch (e) {
      toast.error('Failed to update transcript read status');
    }
  };

export const updateNotes =
  (transcriptID: string, notes: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);
    const transcript = transcriptByIDSelector(state, { id: transcriptID });

    try {
      dispatch(patchTranscript({ key: transcriptID, value: { notes } }));

      await client.transcript.patchTranscript(activeProjectID!, transcriptID, { notes });
    } catch (e) {
      if (transcript) {
        dispatch(patchTranscript({ key: transcriptID, value: { notes: transcript.notes } }));
      }

      toast.error('Failed to update transcript notes');
    }
  };

export const deleteTranscript =
  (transcriptID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state)!;
    const workspaceID = Session.activeWorkspaceIDSelector(state)!;

    try {
      await client.transcript.deleteTranscript(projectID, transcriptID);

      dispatch.sync(Realtime.transcript.crud.remove({ projectID, workspaceID, key: transcriptID.toString() }));
      toast.success('Successfully deleted conversation');
    } catch (e) {
      toast.error('Failed to delete transcript');
    }
  };

export const updateHasUnreadTranscripts = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const activeProjectID = Session.activeProjectIDSelector(state);

  try {
    const hasUnreadTranscripts = await client.transcript.getHasUnreadTranscripts(activeProjectID!);
    dispatch(updateUnreadTranscripts(!!hasUnreadTranscripts));
    // eslint-disable-next-line no-empty
  } catch (e) {}
};

export const exportTranscript =
  (format: TranscriptExportFormat, transcriptID: string, name: string): Thunk =>
  async (_dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state)!;

    try {
      const exportedTranscript = await client.transcript.exportTranscript(activeProjectID, transcriptID, { format });

      const csvBlob = new Blob([exportedTranscript], { type: 'text/csv' });

      downloadBlob(`Conversation with ${name ?? 'Test User'}.${format}`, csvBlob);
    } catch (error) {
      toast.error('Transcript export failed');
    }
  };
