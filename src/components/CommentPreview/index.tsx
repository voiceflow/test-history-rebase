import React from 'react';

import Text from '@/components/Text';

import { Container } from './components';

const MENTION_MARKUP_REGEX = /(\[@[^\]]+])\(user:\d+\)/g;
const MENTION_REGEX = /(@[^\]]+)/g;

export type CommentPreviewProps = {
  text?: string;
};

const CommentPreview: React.FC<CommentPreviewProps> = ({ text = '' }) => {
  const formattedText = React.useMemo(() => {
    return text.replace(MENTION_MARKUP_REGEX, (str: string) => str.match(MENTION_REGEX)![0]);
  }, [text]);

  const styledText = React.useMemo(
    () =>
      formattedText.split(' ').map((str: string, index: number) => (
        <Text key={index} color={str.startsWith('@') ? '#5d9df5' : '#132144'} fontSize={15}>
          {`${str} `}
        </Text>
      )),
    [formattedText]
  );

  return !text ? null : <Container>{styledText}</Container>;
};

export default CommentPreview;
