import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';
import { ChoiceStep } from '@/pages/Canvas/managers/Choice/ChoiceStep';
import { head } from '@/utils/array';

const ConnectedChoiceOldStep: React.FC<ConnectedStepProps<NodeData.Choice>> = ({ node, data, stepProps }) => {
  const [elsePortID, outPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
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
    [data.choices]
  );

  return <ChoiceStep {...stepProps} elsePortID={elsePortID} choices={choices} />;
};

export default ConnectedChoiceOldStep;
