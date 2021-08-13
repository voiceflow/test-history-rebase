import { toast } from '@voiceflow/ui';
import Bowser from 'bowser';

import client from '@/client';
import { TranscriptExportFormat } from '@/client/transcript';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { patchTranscript, removeTranscript, replaceTranscripts } from '@/ducks/transcript/actions';
import { transcriptByIDSelector } from '@/ducks/transcript/selectors';
import { Browser, Device, OperatingSystem, Sentiment, SystemTag } from '@/models';
import { Thunk } from '@/store/types';
import { downloadFromURL } from '@/utils/dom';

export const fetchTranscripts =
  (queryParams?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    try {
      const activeProjectID = Session.activeProjectIDSelector(state);
      const transcripts = await client.transcript.find(activeProjectID || '1', queryParams);
      dispatch(replaceTranscripts(transcripts));
    } catch (e) {
      toast.error('Error fetching transcripts');
    }
  };

export const setUtteranceAddedTo =
  (newUtteranceCount: number, intentName: string, intentID: string, transcriptID: string, turnID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    try {
      const activeProjectID = Session.activeProjectIDSelector(state);
      const { annotations } = transcriptByIDSelector(state)(transcriptID);

      await client.transcript.setTurnUtteranceAddedTo(transcriptID, activeProjectID!, turnID, intentID);

      dispatch(
        patchTranscript(transcriptID, {
          annotations: {
            ...annotations,
            [turnID]: {
              ...(annotations[turnID] ? annotations[turnID] : {}),
              utteranceAddedTo: intentID,
            },
          },
        })
      );

      toast.success(`${newUtteranceCount} utterance(s) added to the ${intentName} intent`);
    } catch (e) {
      toast.error('Error saving');
    }
  };

export const createTranscript = (): Thunk<string | undefined> => async (_dispatch, getState) => {
  const state = getState();
  const { browser, os, platform } = Bowser.parse(window.navigator.userAgent);

  const versionID = Session.activeVersionIDSelector(state);
  const prototypeID = Prototype.prototypeIDSelector(state);
  // unique identifier for session analytics
  const sessionID = `${versionID}.${prototypeID}`;

  const activeProjectID = Session.activeProjectIDSelector(state);
  const deviceType = platform.type as Device;
  const operatingSystem = os.name as OperatingSystem;
  const browserName = browser.name as Browser;

  try {
    const { _id } = await client.transcript.createTranscript(
      { unread: true, device: deviceType!, os: operatingSystem, browser: browserName, sessionID, versionID },
      activeProjectID
    );

    return _id;
  } catch (e) {
    toast.error('Error saving transcript');
    return undefined;
  }
};

export const addTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    const { reportTags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set([...reportTags, tagID])];
    try {
      dispatch(patchTranscript(transcriptID, { reportTags: newTagsArray }));
      await client.transcript.addTag(activeProjectID!, transcriptID, tagID);
    } catch (e) {
      toast.error('Error adding tag');
      dispatch(patchTranscript(transcriptID, { reportTags }));
    }
  };

export const removeTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    const { reportTags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set(reportTags)].filter((tagId) => tagId !== tagID);

    try {
      dispatch(patchTranscript(transcriptID, { reportTags: newTagsArray }));
      await client.transcript.removeTag(activeProjectID!, transcriptID, tagID);
    } catch (e) {
      toast.error('Error removing tag');
      dispatch(patchTranscript(transcriptID, { reportTags }));
    }
  };

export const updateTags =
  (transcriptID: string, tags: string[]): Thunk =>
  async (dispatch) => {
    const updatedTagsArray = [...new Set([...tags])];
    dispatch(patchTranscript(transcriptID, { reportTags: updatedTagsArray }));
  };

export const markAsRead =
  (transcriptID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);
    try {
      await client.transcript.patchTranscript(activeProjectID!, transcriptID, { unread: false });
      dispatch(patchTranscript(transcriptID, { unread: false }));
    } catch (e) {
      toast.error('Failed to update transcript read status');
    }
  };

export const updateNotes =
  (transcriptID: string, notes: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);
    const { notes: initialNotes } = transcriptByIDSelector(state)(transcriptID);

    try {
      dispatch(patchTranscript(transcriptID, { notes }));
      await client.transcript.patchTranscript(activeProjectID!, transcriptID, { notes });
    } catch (e) {
      dispatch(patchTranscript(transcriptID, { notes: initialNotes }));
      toast.error('Failed to update transcript notes');
    }
  };

export const deleteTranscript =
  (transcriptID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);
    try {
      await client.transcript.deleteTranscript(activeProjectID!, transcriptID);
      dispatch(removeTranscript(transcriptID.toString()));
      toast.success('Successfully deleted conversation');
    } catch (e) {
      toast.error('Failed to delete transcript');
    }
  };

export const exportTranscript =
  (format: TranscriptExportFormat, transcriptID: string, name: string): Thunk =>
  async (_dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state)!;

    try {
      const exportedTranscript = await client.transcript.exportTranscript(activeProjectID, transcriptID, { format });

      const csvBlob = new Blob([exportedTranscript], { type: 'text/csv' });

      const url = URL.createObjectURL(csvBlob);
      downloadFromURL(`Conversation with ${name ?? 'Test User'}.${format}`, url);
    } catch (error) {
      toast.error('Transcript export failed');
    }
  };
