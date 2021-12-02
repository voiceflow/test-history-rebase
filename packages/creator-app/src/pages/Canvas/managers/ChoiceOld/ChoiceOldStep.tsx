import { Models, Node } from '@voiceflow/base-types';
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
      noMatch={{ pathName: 'No Match', reprompts: [], types: [Node.Utils.NoMatchType.PATH], randomize: false }}
      noReply={data.noReply}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
      noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
    />
  );
};

export default ConnectedChoiceOldStep;
