import { Link, Text } from '@voiceflow/ui';
import React from 'react';

import { ALL_URLS_REGEX } from '@/constants';
import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTheme } from '@/hooks';
import { isAnyLink, matchAllAndProcess } from '@/utils/string';

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

      if (isAnyLink(result)) {
        nodes.push(
          <Link key={nodes.length} href={result}>
            {result}
          </Link>
        );

        return;
      }

      matchAllAndProcess(result, ALL_URLS_REGEX, (result) => {
        if (typeof result !== 'string') {
          nodes.push(
            <Link key={nodes.length} href={result[0]}>
              {result[0]}
            </Link>
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
