import { Utils } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import AssignToIntentDropdown from '@/pages/NLUManager/components/AssignToIntentDropdown';
import TableToolbar from '@/pages/NLUManager/components/TableToolbar';
import { useNLUManager } from '@/pages/NLUManager/context';

interface TableNavbarProps {
  showFindSimilarButton?: boolean;
}

const TableNavbar: React.FC<TableNavbarProps> = ({ showFindSimilarButton }) => {
  const nluManager = useNLUManager();
  const utterancesByID = useSelector(NLUDuck.unclassifiedUtteranceByIDSelector);

  const selectedUtteranceIDs = React.useMemo(() => {
    const unclassifiedDataClustersMap = Utils.array.createMap(nluManager.unclassifiedDataClusters, ({ id }) => id);

    const clusterUtterances = Array.from(nluManager.selectedClusterIDs).reduce<string[]>((acc, clusterID) => {
      const cluster = unclassifiedDataClustersMap[clusterID];

      return !cluster ? acc : [...acc, ...cluster.utteranceIDs];
    }, []);

    return Utils.array.unique([...clusterUtterances, ...nluManager.selectedUnclassifiedUtteranceIDs]);
  }, [nluManager.selectedClusterIDs, nluManager.selectedUnclassifiedUtteranceIDs, nluManager.unclassifiedDataClusters]);

  const selectedUtterances = selectedUtteranceIDs.length;

  const handleDelete = async () => {
    const utterances = selectedUtteranceIDs.map((id) => utterancesByID[id]);
    await nluManager.deleteUnclassifiedUtterances(utterances);
    toast.success(`Deleted ${utterances.length} utterances`);
  };

  const handleFindSimilar = async () => {
    await nluManager.findSimilar();

    if (!nluManager.isFindingSimilar) {
      nluManager.scrollToTop();
    }
  };

  return (
    <TableToolbar width={641} isOpen={selectedUtterances >= 1} bottom={77}>
      <TableToolbar.LeftActions>
        <TableToolbar.SelectCheckbox onClick={nluManager.resetSelectedUnclassifiedData} />
        <TableToolbar.TextBox>{selectedUtterances} utterances selected</TableToolbar.TextBox>
      </TableToolbar.LeftActions>

      <TableToolbar.Actions>
        <TableToolbar.Icon icon="trash" onClick={handleDelete} />
        {showFindSimilarButton && (
          <TableToolbar.SecondaryButton onClick={handleFindSimilar}>
            {nluManager.isFindingSimilar ? 'Cancel' : 'Find'} Similar
          </TableToolbar.SecondaryButton>
        )}

        <AssignToIntentDropdown
          utteranceIDs={selectedUtteranceIDs}
          renderTrigger={({ onClick, isOpen }) => (
            <TableToolbar.PrimaryButton onClick={onClick} isActive={isOpen}>
              Assign to Intent
            </TableToolbar.PrimaryButton>
          )}
        />
      </TableToolbar.Actions>
    </TableToolbar>
  );
};

export default TableNavbar;
