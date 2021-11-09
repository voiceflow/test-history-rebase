import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';
import { ChoiceStep } from '@/pages/Canvas/managers/Choice/ChoiceStep';

const ConnectedChoiceOldStep: React.FC<ConnectedStepProps<Realtime.NodeData.ChoiceOld>> = ({ node, data }) => {
  const [elsePortID, outPorts] = React.useMemo(() => Utils.array.head(node.ports.out), [node.ports.out]);
  const choiceByPortID = useSyncedLookup(outPorts, data.choices);

  const choices = React.useMemo(
    () =>
      outPorts
        .filter((portID) => choiceByPortID[portID])
        .map((portID, index) => {
          const { synonyms } = choiceByPortID[portID];

          return {
            label: synonyms[0] || `Path ${index + 1}`,
            portID,
          };
        }),
    [outPorts, choiceByPortID]
  );

  return <ChoiceStep nodeID={node.id} elsePortID={elsePortID} choices={choices} isPath elsePathName="No Match" />;
};

export default ConnectedChoiceOldStep;
