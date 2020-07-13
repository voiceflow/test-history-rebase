import React from 'react';
import { Mention, MentionsInput, OnChangeHandlerFunc } from 'react-mentions';

import { Permission, hasPermission } from '@/config/permissions';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { DBWorkspace } from '@/models';
import { ConnectedProps, MergeArguments } from '@/types';

import MentionPreview from '../CommentPreview';
import { MentionEditorContainer, SuggestionItem, mentionEditorStyle, mentionStyle } from './components';
import { formatNameToMention } from './utils';

export { MentionPreview };

export type MentionEditorProps = {
  permissiongType: Permission;
  onChange: (value: string, mentions: number[]) => void;
  value?: string;
  mentionedCreators?: number[];
};

const MentionEditor: React.FC<MentionEditorProps & ConnectedMentionEditorProps> = ({ members, onChange, value, mentionedCreators }) => {
  const [textValue, setTextValue] = React.useState(value ?? '');
  const [mentions, updateMentions] = React.useState<number[]>(mentionedCreators ?? []);

  const onBlur = () => onChange(textValue, mentions);

  const onValueChange: OnChangeHandlerFunc = (e, _, __, mentionedUsers) => {
    setTextValue(e.target.value);
    updateMentions(mentionedUsers.map(({ id }) => parseInt(id, 10)));
  };

  const mentionsData = React.useMemo(() => members.map((member) => ({ id: member.creator_id, display: `@${formatNameToMention(member.name)}` })), [
    members,
  ]);

  return (
    <MentionEditorContainer>
      <MentionsInput
        className="mentionInput"
        placeholder="Comment or @mention"
        value={textValue}
        onChange={onValueChange}
        onBlur={onBlur}
        style={mentionEditorStyle}
      >
        <Mention
          trigger="@"
          markup="[__display__](user:__id__)"
          appendSpaceOnAdd
          data={mentionsData}
          style={mentionStyle}
          renderSuggestion={(suggestion) => <SuggestionItem suggestion={suggestion} members={members} />}
        />
      </MentionsInput>
    </MentionEditorContainer>
  );
};

const mapStateToProps = {
  members: Workspace.activeWorkspaceMembersSelector,
  plan: Workspace.planTypeSelector,
};

const mergeProps = (...[{ members, plan }, , { permissiongType }]: MergeArguments<typeof mapStateToProps, {}, MentionEditorProps>) => ({
  members: members.filter((member: DBWorkspace.Member) => hasPermission(permissiongType, member.role, plan!)),
});

export type ConnectedMentionEditorProps = ConnectedProps<typeof mapStateToProps, {}, typeof mergeProps>;

export default connect(mapStateToProps, null, mergeProps)(MentionEditor as any) as React.FC<MentionEditorProps & ConnectedMentionEditorProps>;
