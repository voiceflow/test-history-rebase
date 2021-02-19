import React from 'react';

import Text from '@/components/Text';
import * as Workspace from '@/ducks/workspace';
import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';
import { connect } from '@/hocs';
import { useTheme } from '@/hooks';
import { ConnectedProps } from '@/types';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /(\[@[^\]]+])\(user:\d+\)/g;
const MENTION_REGEX = /(@[^\]]+)/g;

export type CommentPreviewProps = {
  text?: string;
};

const extractUserID = (text: string) => text.split('user:')[1].replace(')', '');

const UNKNOWN_MEMBER_MENTION = UNKNOWN_MEMBER_DATA.name.replace(' ', '').toLowerCase();

const CommentPreview: React.FC<CommentPreviewProps & ConnectedCommentPreviewProps> = ({ text = '', hasMember }) => {
  const theme = useTheme();
  const formattedText = React.useMemo(
    () =>
      text.replace(MENTION_MARKUP_REGEX, (str: string) => {
        const userID = extractUserID(str);
        const memberExists = hasMember(userID);
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

const mapStateToProps = {
  hasMember: Workspace.hasWorkspaceMemberSelector,
};

type ConnectedCommentPreviewProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(CommentPreview) as React.FC<CommentPreviewProps>;
