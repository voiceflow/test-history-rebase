import React from 'react';

import Text from '@/components/Text';
import * as Workspace from '@/ducks/workspace';
import { UNKNOWN_MEMBER_DATA } from '@/ducks/workspace/constants';
import { connect, withTheme } from '@/hocs';
import { Theme } from '@/styles/theme';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /(\[@[^\]]+])\(user:\d+\)/g;
const MENTION_REGEX = /(@[^\]]+)/g;

export type CommentPreviewProps = {
  text?: string;
  theme?: Theme;
};

const extractUserID = (text: string) => {
  return text.split('user:')[1].replace(')', '');
};

const UNKNOWN_MEMBER_MENTION = UNKNOWN_MEMBER_DATA.name.replace(' ', '').toLowerCase();

const CommentPreview: React.FC<CommentPreviewProps & ConnectedCommentPreviewProps> = ({ theme, text = '', hasMember }) => {
  const formattedText = React.useMemo(() => {
    return text.replace(MENTION_MARKUP_REGEX, (str: string) => {
      const userID = extractUserID(str);
      const memberExists = hasMember(userID);
      return memberExists ? str.match(MENTION_REGEX)![0] : `@${UNKNOWN_MEMBER_MENTION}`;
    });
  }, [text]);

  const styledText = React.useMemo(
    () =>
      formattedText.split(' ').map((str: string, index: number) => (
        <Text key={index} color={str.startsWith('@') ? theme?.colors.blue : theme?.colors.primary} fontSize={15}>
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

export default compose(connect(mapStateToProps), withTheme)(CommentPreview) as React.FC<CommentPreviewProps>;
