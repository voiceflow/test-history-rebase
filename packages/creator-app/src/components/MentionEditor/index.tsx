import { NonNullishRecord, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Mention, MentionsInput, MentionsInputProps, OnChangeHandlerFunc, SuggestionDataItem } from 'react-mentions';
import { createSelector } from 'reselect';

import Commenter from '@/components/Commenter';
import { hasRolePermission, Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';

import MentionPreview from '../CommentPreview';
import { MentionEditorContainer, mentionEditorStyle, mentionStyle } from './components';
import { formatNameToMention } from './utils';

export { MentionPreview };

const activeWorkspaceCommentingMembersSelector = createSelector(
  [WorkspaceV2.active.membersSelector],
  (members) => members.filter((member) => member.name && hasRolePermission(Permission.COMMENTING, member.role)) as NonNullishRecord<Realtime.Member>[]
);

export interface MentionEditorProps {
  value?: string;
  onBlur?: () => void;
  height?: number;
  onChange: (value: string, mentions: number[]) => void;
  inputProps?: Omit<MentionsInputProps, 'children'>;
  placeholder: string;
}

export const MentionEditor: React.FC<MentionEditorProps> = ({ onChange, onBlur, value = '', placeholder, inputProps, height }) => {
  const members = useSelector(activeWorkspaceCommentingMembersSelector);

  const onValueChange: OnChangeHandlerFunc = ({ target }, _, __, mentions) =>
    onChange(target.value, Utils.array.unique(mentions.map(({ id }) => parseInt(id, 10))));

  const mentionsData = React.useMemo(
    () => members.map((member) => ({ id: member.creator_id, display: `@${formatNameToMention(member.name)}` })),
    [members]
  );

  return (
    <MentionEditorContainer>
      <MentionsInput
        className="mentionInput"
        allowSuggestionsAboveCursor={true}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        style={mentionEditorStyle(height)}
        onBlur={onBlur}
        {...inputProps}
      >
        <Mention
          trigger="@"
          markup="[__display__](user:__id__)"
          appendSpaceOnAdd
          data={mentionsData}
          style={mentionStyle}
          renderSuggestion={(suggestion: SuggestionDataItem) => <Commenter bold={false} creatorID={Number(suggestion.id)} />}
        />
      </MentionsInput>
    </MentionEditorContainer>
  );
};

export default MentionEditor;
