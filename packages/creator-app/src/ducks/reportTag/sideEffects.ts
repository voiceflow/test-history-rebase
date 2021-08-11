import { toast } from '@voiceflow/ui';

import client from '@/client';
import { negativeEmotion, neutralEmotion, positiveEmotion } from '@/components/EmojiPicker';
import { allReportTagsSelector } from '@/ducks/reportTag/selectors';
import { activeProjectIDSelector } from '@/ducks/session';
import { Sentiment, SystemTag } from '@/models';
import { Thunk } from '@/store/types';
import THEME from '@/styles/theme';

import { addReportTag, patchReportTag, removeReportTag, replaceReportTags } from './actions';

const BUILT_INS = [
  {
    id: Sentiment.EMOTION_POSITIVE,
    label: 'Positive',
    icon: positiveEmotion,
  },
  {
    id: Sentiment.EMOTION_NEUTRAL,
    label: 'Neutral',
    icon: neutralEmotion,
  },
  {
    id: Sentiment.EMOTION_NEGATIVE,
    label: 'Negative',
    icon: negativeEmotion,
  },
  {
    id: SystemTag.SAVED,
    label: 'Saved for later',
    icon: 'bookmark',
    iconColor: THEME.colors.red,
  },
  {
    id: SystemTag.REVIEWED,
    label: 'Reviewed',
    icon: 'checkmarkFilled',
    iconColor: '#3e9e3e',
  },
];

export const fetchReportTags = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const activeProjectID = activeProjectIDSelector(state);
  let reportTags;
  try {
    reportTags = await client.reportTags.fetchTags(activeProjectID!);
    // To Remove hard coded builtIns
    const builtIns = BUILT_INS.map((val) => {
      return { ...val, projectID: activeProjectID!.toString() };
    });
    reportTags = [...builtIns, ...reportTags];
    dispatch(replaceReportTags(reportTags));
  } catch (e) {
    toast.error('Error fetching report tags');
  }
};

export const createTag =
  // For undoing a delete, we want to preserve the id, so anything that was referencing it in transcripts, will still have the correct reference ID


    (tagLabel: string, id?: string): Thunk<string | null> =>
    async (dispatch, getState) => {
      const state = getState();
      const activeProjectID = activeProjectIDSelector(state);
      const allExistingReportTags = allReportTagsSelector(state);
      const allExistingTagLabels = allExistingReportTags?.map(({ label }) => label) || [];

      if (allExistingTagLabels.includes(tagLabel)) {
        toast.error('Tag already exists');
        return null;
      }
      try {
        const newTag = await client.reportTags.createTag(activeProjectID!, { tagID: id, label: tagLabel });
        const newID = newTag.id.toString();
        dispatch(
          addReportTag(newTag.id.toString(), {
            id: newID,
            projectID: activeProjectID!,
            label: tagLabel,
          })
        );

        return newID;
      } catch (e) {
        toast.error(e);
        return null;
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
      await client.reportTags.patchTag(activeProjectID!, { tagID, label });
      dispatch(patchReportTag(tagID, { id: tagID, label, projectID: activeProjectID! }));
    } catch (e) {
      toast.error('Error updating tag');
    }
  };
