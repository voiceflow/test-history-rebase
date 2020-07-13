import React from 'react';

import Text from '@/components/Text';

const MENTION_MARKUP_REGEX = /(\[@[A-Za-z]+]\(user:\d\))/g;
const MENTION_REGEX = /(@[A-Za-z]+)/g;

export type CommentPreviewProps = {
  text: string;
};

const CommentPreview: React.FC<CommentPreviewProps> = ({ text }) => {
  const localText = text || '';
  const formattedText = React.useMemo(() => {
    return localText.replace(MENTION_MARKUP_REGEX, (str: string) => str.match(MENTION_REGEX)![0]);
  }, [localText]);

  const styledText = React.useMemo(
    () =>
      formattedText.split(' ').map((str: string, index: number) =>
        str.startsWith('@') ? (
          <Text key={index} color="#5d9df5" fontSize={15}>
            {`${str} `}
          </Text>
        ) : (
          <Text key={index} color="#132144" fontSize={15}>{`${str} `}</Text>
        )
      ),
    [formattedText]
  );

  return !localText ? null : <div>{styledText}</div>;
};

export default CommentPreview;
