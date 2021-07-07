import { toast } from '@voiceflow/ui';

import client from '@/client';
import { activeProjectIDSelector } from '@/ducks/session';
import { Sentiment, SystemTag } from '@/models';
import { Thunk } from '@/store/types';

import { addReportTag, patchReportTag, removeReportTag, replaceReportTags } from './actions';

export const DUMMY_DATA = [
  {
    id: '1',
    projectID: '1',
    label: 'happy path',
  },
  {
    id: '2',
    projectID: '1',
    label: 'sad path',
  },
  {
    id: '3',
    projectID: '1',
    label: 'user error',
  },
  {
    id: '4',
    projectID: '1',
    label: 'perfect interaction',
  },
  {
    id: SystemTag.REVIEWED,
    projectID: '1',
    label: '',
  },
  {
    id: SystemTag.SAVED,
    projectID: '1',
    label: '',
  },
  {
    id: Sentiment.EMOTION_POSITIVE,
    projectID: '1',
    label: '',
  },
];

export const fetchReportTags = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const activeProjectID = activeProjectIDSelector(state);
  let reportTags;
  try {
    reportTags = await client.reportTags.fetchTags(activeProjectID!);
    dispatch(replaceReportTags(reportTags));
  } catch (e) {
    toast.error('Error fetching report tags');
  }
};

export const createTag =
  // For undoing a delete, we want to preserve the id, so anything that was referencing it in transcripts, will still have the correct reference ID


    (tagLabel: string, id?: string): Thunk =>
    async (dispatch, getState) => {
      const state = getState();
      const activeProjectID = activeProjectIDSelector(state);
      try {
        const newTag = await client.reportTags.createTag(activeProjectID!, { previousID: id, label: tagLabel });

        dispatch(
          addReportTag(newTag.id.toString(), {
            id: newTag.id.toString(),
            projectID: activeProjectID!,
            label: tagLabel,
          })
        );
      } catch (e) {
        toast.error(e);
      }
    };

export const deleteTag =
  (tagID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = activeProjectIDSelector(state);

    try {
      await client.reportTags.deleteTag(activeProjectID!, tagID);
      dispatch(removeReportTag(tagID.toString()));
    } catch (e) {
      toast.error('Error deleting tag');
    }
  };

export const updateTag =
  (tagID: string, label: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = activeProjectIDSelector(state);

    try {
      await client.reportTags.patchTag(activeProjectID!, { id: tagID, label });
      dispatch(patchReportTag(tagID, { id: tagID, label, projectID: activeProjectID! }));
    } catch (e) {
      toast.error('Error updating tag');
    }
  };
