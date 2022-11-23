import { Box, Link, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

interface SearchButtonProps {
  onSearch: (text: string) => void;
}

const EmptySearchPage: React.FC<SearchButtonProps> = ({ onSearch }) => {
  const clearFilters = () => {
    onSearch('');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Box.FlexCenter flexDirection="column" style={{ width: '100%', height: '100%' }}>
        <SvgIcon icon="noContent" size={80} />
        <Text color="#132144" fontWeight={600} paddingTop="16px" paddingBottom="8px">
          No search results
        </Text>
        <Text color="#62778C" width="250px" textAlign="center">
          Create your first assistant, or get started with a tutorial.
          <Link onClick={clearFilters} paddingLeft="4px">
            Clear filters
          </Link>
        </Text>
      </Box.FlexCenter>
    </div>
  );
};

export default EmptySearchPage;
