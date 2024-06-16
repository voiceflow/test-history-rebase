import { System, Text } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTheme } from '@/hooks';
import { isValidURL, matchAllAndProcess } from '@/utils/string';
import { ALL_URLS_REGEX } from '@/utils/string.util';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /\[(@[^\]]+)]\(user:(\d+)\)/g;

export interface CommentPreviewProps {
  text?: string;
}

const UNKNOWN_MEMBER_MENTION = WorkspaceV2.UNKNOWN_MEMBER_DATA.name.replace(' ', '').toLowerCase();

const CommentPreview: React.FC<CommentPreviewProps> = ({ text = '' }) => {
  const hasMemberByID = useSelector(WorkspaceV2.active.members.hasMemberByIDSelector);

  const theme = useTheme();

  const formattedText = React.useMemo(() => {
    const nodes: React.ReactNode[] = [];

    matchAllAndProcess(text, MENTION_MARKUP_REGEX, (result) => {
      if (typeof result !== 'string') {
        const [, userMention, userID] = result;

        const memberExists = hasMemberByID(Number(userID));

        nodes.push(
          <Text key={nodes.length} color={theme.colors.blue}>
            {memberExists ? userMention : `@${UNKNOWN_MEMBER_MENTION}`}
          </Text>
        );

        return;
      }

      if (isValidURL(result)) {
        nodes.push(
          <System.Link.Anchor key={nodes.length} href={result}>
            {result}
          </System.Link.Anchor>
        );

        return;
      }

      matchAllAndProcess(result, ALL_URLS_REGEX, (result) => {
        if (typeof result !== 'string') {
          nodes.push(
            <System.Link.Anchor key={nodes.length} href={result[0]}>
              {result[0]}
            </System.Link.Anchor>
          );
        } else {
          nodes.push(<span key={nodes.length}>{result}</span>);
        }
      });
    });

    return nodes;
  }, [text]);

  return !text ? null : <Container>{formattedText}</Container>;
};

export default CommentPreview;
