import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';

const focusedNodeRepromptSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => (data && (data as Realtime.NodeData<{ reprompt?: Realtime.NodeData.Reprompt }>).reprompt) || null
);

// eslint-disable-next-line import/prefer-default-export
export const useFocusedNodeReprompt = <T extends Realtime.NodeData.Reprompt>(): [
  reprompt: Nullable<T>,
  updateReprompt: (value: Partial<T>) => void
] => {
  const focus = useSelector(Creator.creatorFocusSelector);
  const reprompt = useSelector(focusedNodeRepromptSelector) as Nullable<T>;

  const updateData = useUpdateData(focus.target);
  const updateReprompt = React.useCallback((value: Partial<T>) => updateData({ reprompt: { ...reprompt, ...value } }), [reprompt, updateData]);

  return [reprompt, updateReprompt];
};
