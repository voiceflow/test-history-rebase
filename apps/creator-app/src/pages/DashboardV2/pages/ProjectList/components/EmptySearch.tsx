import { Box, Link, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

interface SearchButtonProps {
  onClear: VoidFunction;
}

const EmptySearchPage: React.FC<SearchButtonProps> = ({ onClear }) => (
  <Box.FlexCenter mt={-42} flexDirection="column" width="100%" height="100%">
    <SvgIcon icon="noContent" size={80} />

    <Text color="#132144" fontWeight={600} paddingTop="16px" paddingBottom="8px">
      No search results
    </Text>

    <Text color="#62778C" width="250px" textAlign="center">
      Create your first agent, or get started with a tutorial.
      <Link onClick={onClear} paddingLeft="4px">
        Clear filters
      </Link>
    </Text>
  </Box.FlexCenter>
);

export default EmptySearchPage;
