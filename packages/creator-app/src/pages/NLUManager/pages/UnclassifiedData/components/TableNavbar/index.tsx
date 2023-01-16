import React from 'react';

import TableToolbar from '@/pages/NLUManager/components/TableToolbar';
import { useNLUManager } from '@/pages/NLUManager/context';

interface TableNavbarProps {
  showFindSimilarButton?: boolean;
}

const TableNavbar: React.OldFC<TableNavbarProps> = ({ showFindSimilarButton }) => {
  const nluManager = useNLUManager();
  const selectedUtterances = React.useMemo(() => {
    const clusterUtterancesCount = Array.from(nluManager.selectedClusterIDs).reduce((acc, clusterID) => {
      const cluster = nluManager.unclassifiedDataClusters.find((c) => c.id === clusterID);

      if (!cluster) return acc;

      return acc + cluster.utteranceIDs.length;
    }, 0);

    return clusterUtterancesCount + nluManager.selectedUnclassifiedUtteranceIDs.size;
  }, [nluManager.selectedClusterIDs, nluManager.selectedUnclassifiedUtteranceIDs, nluManager.unclassifiedDataClusters]);

  return (
    <TableToolbar width={641} isOpen={selectedUtterances >= 2} bottom={77}>
      <TableToolbar.LeftActions>
        <TableToolbar.SelectCheckbox onClick={nluManager.resetSelectedUnclassifiedData} />
        <TableToolbar.TextBox>{selectedUtterances} utterances selected</TableToolbar.TextBox>
      </TableToolbar.LeftActions>

      <TableToolbar.Actions>
        <TableToolbar.Icon icon="trash" />
        {showFindSimilarButton && (
          <TableToolbar.SecondaryButton onClick={nluManager.findSimilar}>
            {nluManager.isFindingSimilar ? 'Cancel' : 'Find'} Similar
          </TableToolbar.SecondaryButton>
        )}
        <TableToolbar.PrimaryButton>Assign to Intent</TableToolbar.PrimaryButton>
      </TableToolbar.Actions>
    </TableToolbar>
  );
};

export default TableNavbar;
