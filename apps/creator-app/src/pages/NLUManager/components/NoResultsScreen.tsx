import { Box, FlexCenter, SvgIcon, System } from '@voiceflow/ui';
import React from 'react';

interface noResultsScreen {
  onCleanFilters: VoidFunction;
  itemName: string;
}

const NoResultsScreen: React.FC<noResultsScreen> = ({ onCleanFilters, itemName }) => {
  return (
    <Box p="60px 74px">
      <FlexCenter>
        <SvgIcon size={80} icon="noContent" />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          No search results
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          We found no {itemName} that match your search results. <System.Link.Button onClick={onCleanFilters}>Clear filters</System.Link.Button>
        </Box>
      </FlexCenter>
    </Box>
  );
};

export default NoResultsScreen;
