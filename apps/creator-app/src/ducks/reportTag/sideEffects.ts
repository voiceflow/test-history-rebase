import { toast } from '@voiceflow/ui';

import client from '@/client';
import * as Errors from '@/config/errors';
import { allReportTagsSelector } from '@/ducks/reportTag/selectors';
import { activeProjectIDSelector } from '@/ducks/session';
import { SystemTag } from '@/models';
import { Thunk } from '@/store/types';
import { getErrorMessage } from '@/utils/error';

import { addReportTag, patchReportTag, removeReportTag, replaceReportTags } from './actions';

const BUILT_INS = [
  {
    id: SystemTag.SAVED,
    label: 'Saved for later',
    icon: 'bookmarkActive',
    iconColor: '#bf395b',
  },
  {
    id: SystemTag.REVIEWED,
    label: 'Reviewed',
    icon: 'checkmarkFilled',
    iconColor: '#449127',
  },
];

export const fetchReportTags = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const activeProjectID = activeProjectIDSelector(state);

  Errors.assertWorkspaceID(activeProjectID);

  try {
    const reportTags = await client.reportTags.fetchTags(activeProjectID);

    // To Remove hard coded builtIns
    const builtIns = BUILT_INS.map((val) => ({ ...val, projectID: activeProjectID }));

    dispatch(replaceReportTags([...builtIns, ...reportTags]));
  } catch (e) {
    toast.error('Error fetching report tags');
  }
};

// For undoing a delete, we want to preserve the id, so anything that was referencing it in transcripts, will still have the correct reference ID
export const createTag =
  (tagLabel: string, id?: string): Thunk<string | null> =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = activeProjectIDSelector(state);
    const allExistingReportTags = allReportTagsSelector(state) ?? [];

    Errors.assertWorkspaceID(activeProjectID);

    if (allExistingReportTags.some((tag) => tag.label === tagLabel)) {
      toast.error('Tag already exists');
      return null;
    }

    try {
      const newTag = await client.reportTags.createTag(activeProjectID, { tagID: id, label: tagLabel });

      dispatch(addReportTag(newTag.id, { id: newTag.id, label: tagLabel, projectID: activeProjectID }));

      return newTag.id;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return null;
    }
  };

export const deleteTag =
  (tagID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeProjectID = activeProjectIDSelector(state);

    Errors.assertWorkspaceID(activeProjectID);

    try {
      await client.reportTags.deleteTag(activeProjectID, tagID);

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

    Errors.assertWorkspaceID(activeProjectID);

    try {
      await client.reportTags.patchTag(activeProjectID, { tagID, label });

      dispatch(patchReportTag(tagID, { id: tagID, label, projectID: activeProjectID }));
    } catch (e) {
      toast.error('Error updating tag');
    }
  };
