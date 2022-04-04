import { Nullable } from '@voiceflow/common';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTheme } from '@/hooks';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /\[(@[^\]]+)]\(user:(\d+)\)/g;

export interface CommentPreviewProps {
  text?: string;
}

const UNKNOWN_MEMBER_MENTION = UNKNOWN_MEMBER_DATA.name.replace(' ', '').toLowerCase();

const CommentPreview: React.FC<CommentPreviewProps> = ({ text = '' }) => {
  const hasMemberByID = useSelector(WorkspaceV2.active.hasMemberByIDSelector);

  const theme = useTheme();

  const formattedText = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];

    let prevMatch: Nullable<RegExpMatchArray> = null;

    // eslint-disable-next-line no-restricted-syntax
    for (const match of text.matchAll(MENTION_MARKUP_REGEX)) {
      const [, userMention, userID] = match;

      nodes.push(
        <Text key={nodes.length} color={theme.colors.primary} fontSize={15}>
          {`${text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, match.index)}`}
        </Text>
      );

      const memberExists = hasMemberByID(Number(userID));

      nodes.push(
        <Text key={nodes.length} color={theme.colors.blue} fontSize={15}>
          {memberExists ? userMention : `@${UNKNOWN_MEMBER_MENTION}`}
        </Text>
      );

      prevMatch = match;
    }

    nodes.push(
      <Text key={nodes.length} color={theme.colors.primary} fontSize={15}>
        {text.substring(prevMatch ? (prevMatch.index ?? 0) + prevMatch[0].length : 0, text.length)}
      </Text>
    );

    return nodes;
  }, [text]);

  return !text ? null : <Container>{formattedText}</Container>;
};

export default CommentPreview;
