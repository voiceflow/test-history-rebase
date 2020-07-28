import React from 'react';
import { Mention, MentionsInput, MentionsInputProps, OnChangeHandlerFunc, SuggestionDataItem } from 'react-mentions';

import Commenter from '@/components/Commenter';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import MentionPreview from '../CommentPreview';
import { MentionEditorContainer, mentionEditorStyle, mentionStyle } from './components';
import { formatNameToMention } from './utils';

export { MentionPreview };

export type MentionEditorProps = {
  onChange: (value: string, mentions: number[]) => void;
  value?: string;
  placeholder: string;
  inputProps?: MentionsInputProps;
  onBlur?: () => void;
};

export const MentionEditor: React.FC<MentionEditorProps & ConnectedMentionEditorProps> = ({
  members,
  onChange,
  onBlur,
  value = '',
  placeholder,
  inputProps,
}) => {
  const onValueChange: OnChangeHandlerFunc = (e, _, __, mentions) =>
    onChange(
      e.target.value,
      mentions.map(({ id }) => parseInt(id, 10))
    );

  const mentionsData = React.useMemo(() => members.map((member) => ({ id: member.creator_id, display: `@${formatNameToMention(member.name)}` })), [
    members,
  ]);

  return (
    <MentionEditorContainer>
      <MentionsInput
        className="mentionInput"
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        style={mentionEditorStyle}
        onBlur={onBlur}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
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

const mapStateToProps = {
  members: Workspace.activeWorkspaceCommentingMembersSelector,
};

export type ConnectedMentionEditorProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(MentionEditor as any) as React.FC<MentionEditorProps>;
