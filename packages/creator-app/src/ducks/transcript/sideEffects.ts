import { toast } from '@voiceflow/ui';

import transcriptAdapter from '@/client/adapters/transcripts/transcripts';
import { prototypeContextHistorySelector } from '@/ducks/prototype';
import { patchTranscript, replaceTranscripts } from '@/ducks/transcript/actions';
import { transcriptByIDSelector } from '@/ducks/transcript/selectors';
import { Browser, Device, OperatingSystem, PrototypeContext, Sentiment, SystemTag, Trace } from '@/models';
import { Thunk } from '@/store/types';

export const DUMMY_DATA = [
  {
    id: '1',
    creatorID: '2',
    projectID: '123',
    device: Device.DESKTOP,
    os: OperatingSystem.LINUX,
    browser: Browser.FIREFOX,
    notes: 'That was great',
    createdAt: 0,
    name: 'Josh Ho',
    date: '9:39 am, May 1st',
    tags: ['1', '3', SystemTag.REVIEWED, Sentiment.EMOTION_POSITIVE],
    unread: true,
  },
  {
    id: '2',
    creatorID: '2',
    projectID: '123',
    device: Device.DESKTOP,
    os: OperatingSystem.MAC,
    browser: Browser.FIREFOX,
    notes: 'Awsome stuff',
    createdAt: 0,
    name: 'Mike Hood',
    date: '1:79 am, May 2st',
    tags: ['3', '5', SystemTag.SAVED, Sentiment.EMOTION_POSITIVE],
    unread: false,
  },
  {
    id: '3',
    creatorID: '2',
    projectID: '123',
    device: Device.MOBILE,
    os: OperatingSystem.MAC,
    browser: Browser.CHROME,
    notes: '',
    createdAt: 0,
    name: 'Barack Obama',
    date: '1:79 am, May 2st',
    tags: ['4', '1', SystemTag.REVIEWED, SystemTag.SAVED],
    unread: true,
  },
  {
    id: '4',
    creatorID: '2',
    projectID: '123',
    device: Device.DESKTOP,
    os: OperatingSystem.LINUX,
    browser: Browser.CHROME,
    notes: '',
    createdAt: 0,
    name: 'Donald Trump',
    date: '1:79 am, May 2st',
    tags: ['1', '4', SystemTag.SAVED],
    unread: false,
  },
  {
    id: '5',
    creatorID: '2',
    projectID: '123',
    device: Device.DESKTOP,
    os: OperatingSystem.WINDOWS,
    browser: Browser.SAFARI,
    notes: '',
    createdAt: 0,
    name: 'Tyler Han',
    date: '1:79 am, May 2st',
    tags: ['1', '3', Sentiment.EMOTION_NEUTRAL],
    unread: false,
  },
  {
    id: '6',
    creatorID: '2',
    projectID: '123',
    device: Device.MOBILE,
    os: OperatingSystem.MAC,
    browser: Browser.CHROME,
    notes: 'Yeeet',
    createdAt: 0,
    name: 'Andrew Lawrence',
    date: '1:79 am, May 2st',
    tags: ['4', '1', SystemTag.SAVED, Sentiment.EMOTION_NEGATIVE],
    unread: false,
  },
  {
    id: '7',
    creatorID: '2',
    projectID: '123',
    device: Device.MOBILE,
    os: OperatingSystem.LINUX,
    browser: Browser.FIREFOX,
    notes: 'Really good use case and responses!',
    createdAt: 0,
    name: 'Braden Ream',
    date: '1:79 am, May 2nd',
    tags: ['5', SystemTag.REVIEWED, Sentiment.EMOTION_POSITIVE],
    unread: true,
  },
];

export const fetchTranscripts = (): Thunk => async (dispatch, _getState) => {
  try {
    // TODO fetch transcripts from pg
    const newTranscripts = DUMMY_DATA.map((data) => transcriptAdapter.fromDB(data));
    dispatch(replaceTranscripts(newTranscripts));
  } catch (e) {
    toast.error('Error fetching transcripts');
  }
};

// Gets the prototype session history and sends it to the save endpoint to save in S3
export const savePrototypeSession = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const prototypeContextHistory: Partial<PrototypeContext>[] = prototypeContextHistorySelector(state);
  let allTraces: Trace[] = [];
  prototypeContextHistory?.forEach((context) => {
    if (context.trace) {
      allTraces = [...allTraces, ...context.trace];
    }
  });
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
