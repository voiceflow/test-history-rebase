import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import { noIntentsGraphic } from '@/assets';

import { FilterType } from '../constants';

export interface NoCommentsProps {
  type?: FilterType;
}

const NoComments: React.FC<NoCommentsProps> = ({ type }) => {
  const isResolved = type === FilterType.RESOLVED;

  const mainText = type ? `No ${isResolved ? 'resolved' : 'open'} threads` : 'No threads exist';

  const description = isResolved
    ? 'Once you have resolved comments, they will appear here.'
    : "Looks like you haven't added any comments yet. When you do they'll be listed here.";

  return (
    <BoxFlex column pl={57} pr={57}>
      <Box as="img" alt="No Comments" height={80} src={noIntentsGraphic} mt={90} />

      <Text mt={20} fontWeight={600} fontSize={15}>
        {mainText}
      </Text>

      <Text color="#62778c" pt={16} fontSize={15} textAlign="center">
        {description}
      </Text>
    </BoxFlex>
  );
};

export default NoComments;
