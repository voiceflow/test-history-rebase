import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { ConnectedStep } from '@/pages/Canvas/components/Step';
import { ChoiceStep } from '@/pages/Canvas/managers/Choice/ChoiceStep';

const ConnectedChoiceOldStep: ConnectedStep<Realtime.NodeData.ChoiceOld> = ({ node, data }) => {
  const choiceByPortID = useSyncedLookup(node.ports.out.dynamic, data.choices);

  const choices = React.useMemo(
    () =>
      node.ports.out.dynamic
        .filter((portID) => choiceByPortID[portID])
        .map((portID, index) => {
          const { synonyms } = choiceByPortID[portID];

          return {
            key: portID,
            label: synonyms[0] || `Path ${index + 1}`,
            portID,
          };
        }),
    [node.ports.out.dynamic, choiceByPortID]
  );

  return (
    <ChoiceStep
      nodeID={node.id}
      choices={choices}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NEXT]!}
      withNoMatchPath
      noMatchPathName="No Match"
    />
  );
};

export default ConnectedChoiceOldStep;
