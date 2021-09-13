import { Text } from '@voiceflow/ui';
import React from 'react';

import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector, useTheme } from '@/hooks';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /(\[@[^\]]+])\(user:\d+\)/g;
const MENTION_REGEX = /(@[^\]]+)/g;

export interface CommentPreviewProps {
  text?: string;
}

const extractUserID = (text: string) => text.split('user:')[1].replace(')', '');

const UNKNOWN_MEMBER_MENTION = UNKNOWN_MEMBER_DATA.name.replace(' ', '').toLowerCase();

const CommentPreview: React.FC<CommentPreviewProps> = ({ text = '' }) => {
  const hasMemberByID = useSelector(WorkspaceV2.active.hasMemberByIDSelector);

  const theme = useTheme();
  const formattedText = React.useMemo(
    () =>
      text.replace(MENTION_MARKUP_REGEX, (str: string) => {
        const userID = extractUserID(str);
        const memberExists = hasMemberByID(Number(userID));

        return memberExists ? str.match(MENTION_REGEX)![0] : `@${UNKNOWN_MEMBER_MENTION}`;
      }),
    [text]
  );

  const styledText = React.useMemo(
    () =>
      formattedText.split(' ').map((str: string, index: number) => (
        <Text key={index} color={str.startsWith('@') ? theme.colors.blue : theme.colors.primary} fontSize={15}>
          {`${str} `}
        </Text>
      )),
    [formattedText]
  );

  return !text ? null : <Container>{styledText}</Container>;
};

export default CommentPreview;
