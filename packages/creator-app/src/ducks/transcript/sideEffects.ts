import { toast } from '@voiceflow/ui';
import Bowser from 'bowser';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { patchTranscript, removeTranscript, replaceTranscripts } from '@/ducks/transcript/actions';
import { transcriptByIDSelector } from '@/ducks/transcript/selectors';
import { Browser, Device, OperatingSystem, Sentiment, SystemTag } from '@/models';
import { Thunk } from '@/store/types';

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

export const createTranscript = (): Thunk => async (_dispatch, getState) => {
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
    await client.transcript.createTranscript(
      { device: deviceType!, os: operatingSystem, browser: browserName, sessionID, versionID },
      activeProjectID
    );
  } catch (e) {
    toast.error('Error saving transcript');
  }
};

export const addTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    const { tags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set([...tags, tagID])];
    try {
      dispatch(patchTranscript(transcriptID, { tags: newTagsArray }));
      await client.transcript.addTag(activeProjectID!, transcriptID, tagID);
    } catch (e) {
      toast.error('Error adding tag');
      dispatch(patchTranscript(transcriptID, { tags }));
    }
  };

export const removeTag =
  (transcriptID: string, tagID: string | SystemTag | Sentiment): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = Session.activeProjectIDSelector(state);

    const { tags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set(tags)].filter((tagId) => tagId !== tagID);

    try {
      dispatch(patchTranscript(transcriptID, { tags: newTagsArray }));
      await client.transcript.removeTag(activeProjectID!, transcriptID, tagID);
    } catch (e) {
      toast.error('Error removing tag');
      dispatch(patchTranscript(transcriptID, { tags }));
    }
  };

export const updateTags =
  (transcriptID: string, tags: string[]): Thunk =>
  async (dispatch) => {
    const updatedTagsArray = [...new Set([...tags])];
    dispatch(patchTranscript(transcriptID, { tags: updatedTagsArray }));
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
    try {
      await client.transcript.patchTranscript(activeProjectID!, transcriptID, { notes });
      dispatch(patchTranscript(transcriptID, { notes }));
    } catch (e) {
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
