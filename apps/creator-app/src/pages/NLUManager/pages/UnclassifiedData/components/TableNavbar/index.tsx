import { Utils } from '@voiceflow/common';
import { Table } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import AssignToIntentDropdown from '@/pages/NLUManager/components/AssignToIntentDropdown';
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
    <Table.Toolbar width={641} isOpen={selectedUtterances >= 1} bottom={77}>
      <Table.Toolbar.LeftActions>
        <Table.Toolbar.SelectCheckbox onClick={nluManager.resetSelectedUnclassifiedData} />
        <Table.Toolbar.TextBox>{selectedUtterances} utterances selected</Table.Toolbar.TextBox>
      </Table.Toolbar.LeftActions>

      <Table.Toolbar.Actions>
        <Table.Toolbar.Icon icon="trash" onClick={handleDelete} />
        {showFindSimilarButton && (
          <Table.Toolbar.SecondaryButton onClick={handleFindSimilar}>
            {nluManager.isFindingSimilar ? 'Cancel' : 'Find'} Similar
          </Table.Toolbar.SecondaryButton>
        )}

        <AssignToIntentDropdown
          utteranceIDs={selectedUtteranceIDs}
          renderTrigger={({ onClick, isOpen }) => (
            <Table.Toolbar.PrimaryButton onClick={onClick} isActive={isOpen}>
              Assign to Intent
            </Table.Toolbar.PrimaryButton>
          )}
        />
      </Table.Toolbar.Actions>
    </Table.Toolbar>
  );
};

export default TableNavbar;
