import { Utils } from '@voiceflow/common';
import React from 'react';
import type { MentionsInputProps, OnChangeHandlerFunc, SuggestionDataItem } from 'react-mentions';
import { Mention, MentionsInput } from 'react-mentions';
import { createSelector } from 'reselect';

import Commenter from '@/components/Commenter';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTheme } from '@/hooks';
import { hasRolePermission } from '@/utils/rolePermission';

import MentionPreview from '../CommentPreview';
import { MentionEditorContainer, mentionEditorStyle, mentionStyle, MentionSuggestionStyles } from './components';
import { formatNameToMention } from './utils';

export { MentionPreview };

const activeWorkspaceCommentingMembersSelector = createSelector(
  [WorkspaceV2.active.normalizedMembersSelector],
  (members) => members.filter((member) => hasRolePermission(Permission.COMMENTING, member.role))
);

export interface MentionEditorProps {
  value?: string;
  onBlur?: () => void;
  height?: number;
  onChange: (value: string, mentions: number[]) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  inputProps?: Omit<MentionsInputProps, 'children'>;
  placeholder: string;
}

export const MentionEditor: React.FC<MentionEditorProps> = ({
  onChange,
  onBlur,
  value = '',
  placeholder,
  inputProps,
  height,
  inputRef,
}) => {
  const theme = useTheme();
  const members = useSelector(activeWorkspaceCommentingMembersSelector);

  const onValueChange: OnChangeHandlerFunc = ({ target }, _, __, mentions) =>
    onChange(target.value, Utils.array.unique(mentions.map(({ id }) => parseInt(id, 10))));

  const mentionsData = React.useMemo(
    () => members.map((member) => ({ id: member.creator_id, display: `@${formatNameToMention(member.name)}` })),
    [members]
  );

  return (
    <MentionEditorContainer>
      <MentionSuggestionStyles />

      <MentionsInput
        inputRef={inputRef}
        value={value}
        style={mentionEditorStyle({ theme, height })}
        onBlur={onBlur}
        onChange={onValueChange}
        className="mentionInput"
        placeholder={placeholder}
        suggestionsPortalHost={document.body}
        allowSuggestionsAboveCursor={true}
        {...inputProps}
      >
        <Mention
          data={mentionsData}
          style={mentionStyle}
          markup="[__display__](user:__id__)"
          trigger="@"
          renderSuggestion={(suggestion: SuggestionDataItem) => (
            <Commenter bold={false} creatorID={Number(suggestion.id)} />
          )}
          appendSpaceOnAdd
        />
      </MentionsInput>
    </MentionEditorContainer>
  );
};

export default MentionEditor;
