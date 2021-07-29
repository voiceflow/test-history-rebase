import React from 'react';
import { Mention, MentionsInput, MentionsInputProps, OnChangeHandlerFunc, SuggestionDataItem } from 'react-mentions';

import Commenter from '@/components/Commenter';
import { useActiveWorkspaceCommentingMembersSelector } from '@/hooks';

import MentionPreview from '../CommentPreview';
import { MentionEditorContainer, mentionEditorStyle, mentionStyle } from './components';
import { formatNameToMention } from './utils';

export { MentionPreview };

export interface MentionEditorProps {
  onChange: (value: string, mentions: number[]) => void;
  value?: string;
  placeholder: string;
  inputProps?: Omit<MentionsInputProps, 'children'>;
  onBlur?: () => void;
  height?: number;
}

export const MentionEditor: React.FC<MentionEditorProps> = ({ onChange, onBlur, value = '', placeholder, inputProps, height }) => {
  const members = useActiveWorkspaceCommentingMembersSelector();

  const onValueChange: OnChangeHandlerFunc = (e, _, __, mentions) =>
    onChange(
      e.target.value,
      mentions.map(({ id }) => parseInt(id, 10))
    );

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
          // suggestion.id type is coming from the editor library, casting it as number as we know the type of id
          renderSuggestion={(suggestion: SuggestionDataItem) => <Commenter creatorID={suggestion.id as number} />}
        />
      </MentionsInput>
    </MentionEditorContainer>
  );
};

export default MentionEditor;
