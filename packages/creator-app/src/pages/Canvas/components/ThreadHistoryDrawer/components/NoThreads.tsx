import React from 'react';

import { noIntentsGraphic } from '@/assets';
import Box, { Flex } from '@/components/Box';
import Text from '@/components/Text';

import { FILTER_LABELS, FilterType } from '../constants';

export type NoCommentsProps = {
  type?: FilterType;
};

const NoComments: React.FC<NoCommentsProps> = ({ type }) => {
  const mainText = type ? `No ${FILTER_LABELS[type]} Comments` : 'No Comments Exist';
  const description =
    type === FilterType.RESOLVED
      ? 'Once you have resolved comments, they will appear here.'
      : "Looks like you haven't added any comments yet. When you do they'll be listed here.";

  return (
    <Flex column pl={57} pr={57}>
      <Box as="img" alt="No Comments" height={80} src={noIntentsGraphic} mt={90} />
      <Text mt={20} fontWeight={600} fontSize={15}>
        {mainText}
      </Text>
      <Text color="#62778c" pt={16} fontSize={15} textAlign="center">
        {description}
      </Text>
    </Flex>
  );
};

export default NoComments;
