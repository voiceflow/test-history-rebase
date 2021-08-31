import { Nullable } from '@voiceflow/ui';
import React from 'react';
import { createSelector } from 'reselect';

import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';
import { NodeData } from '@/models';
import { useUpdateData } from '@/pages/Canvas/components/EditorSidebar/hooks';

const focusedNodeRepromptSelector = createSelector(
  Creator.focusedNodeDataSelector,
  (data) => (data && (data as NodeData<{ reprompt?: NodeData.Reprompt }>).reprompt) || null
);

// eslint-disable-next-line import/prefer-default-export
export const useFocusedNodeReprompt = <T extends NodeData.Reprompt>(): [reprompt: Nullable<T>, updateReprompt: (value: Partial<T>) => void] => {
  const focus = useSelector(Creator.creatorFocusSelector);
  const reprompt = useSelector(focusedNodeRepromptSelector) as Nullable<T>;

  const updateData = useUpdateData(focus.target);
  const updateReprompt = React.useCallback((value: Partial<T>) => updateData({ reprompt: { ...reprompt, ...value } }), [reprompt, updateData]);

  return [reprompt, updateReprompt];
};
