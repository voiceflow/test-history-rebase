import { toast } from '@voiceflow/ui';
import Bowser from 'bowser';

import client from '@/client';
import * as Account from '@/ducks/account';
import { activeProjectIDSelector } from '@/ducks/session';
import * as Session from '@/ducks/session';
import { patchTranscript, removeTranscript, replaceTranscripts } from '@/ducks/transcript/actions';
import { transcriptByIDSelector } from '@/ducks/transcript/selectors';
import { Browser, Device, OperatingSystem, SystemTag } from '@/models';
import { Thunk } from '@/store/types';

export const fetchTranscripts = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  try {
    const activeProjectID = activeProjectIDSelector(state);
    const transcripts = await client.transcript.find(activeProjectID!, '');
    dispatch(replaceTranscripts(transcripts));
  } catch (e) {
    toast.error('Error fetching transcripts');
  }
};

export const createTranscript = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const { browser, os, platform } = Bowser.parse(window.navigator.userAgent);

  const versionID = Session.activeVersionIDSelector(state);
  // unique identifier for session analytics
  const sessionID = `${versionID}.${Account.userIDSelector(state) || Session.browserIDSelector(state)}`;

  const activeProjectID = activeProjectIDSelector(state);
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
  (transcriptID: string, tag: SystemTag | string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const { tags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set([...tags, tag])];

    // TODO client call to save to db

    dispatch(patchTranscript(transcriptID, { tags: newTagsArray }));
  };

export const removeTag =
  (transcriptID: string, tag: SystemTag | string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const { tags } = transcriptByIDSelector(state)(transcriptID);
    const newTagsArray = [...new Set(tags)].filter((tagName) => tagName !== tag);

    // TODO client call to save to db

    dispatch(patchTranscript(transcriptID, { tags: newTagsArray }));
  };

export const updateTags =
  (transcriptID: string, tags: string[]): Thunk =>
  async (dispatch) => {
    dispatch(patchTranscript(transcriptID, { tags }));
  };

export const markAsRead =
  (transcriptID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = activeProjectIDSelector(state);
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
    const activeProjectID = activeProjectIDSelector(state);
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
    const activeProjectID = activeProjectIDSelector(state);
    try {
      await client.transcript.deleteTranscript(activeProjectID!, transcriptID);
      dispatch(removeTranscript(transcriptID.toString()));
      toast.success('Successfully deleted conversation');
    } catch (e) {
      toast.error('Failed to delete transcript');
    }
  };
