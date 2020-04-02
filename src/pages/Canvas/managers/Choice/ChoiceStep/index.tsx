import React from 'react';

import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { head } from '@/utils/array';
import { prettifyIntentName } from '@/utils/intent';

export type ChoiceStepProps = {
  choices: { label: string | null; portID: string }[];
  elsePortID: string;
};

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ choices, elsePortID }) => {
  return (
    <Step>
      {!!choices.length && (
        <Section>
          {choices.map(({ label, portID }, index) => (
            <Item
              icon={index === 0 ? 'choice' : null}
              iconColor="#3a5999"
              portID={portID}
              label={label}
              placeholder={`Path ${index + 1}`}
              key={portID}
            />
          ))}
        </Section>
      )}
      <ElseItem portID={elsePortID} />
    </Step>
  );
};

type ConnectedChoiceStepProps = ConnectedStepProps<NodeData.Interaction> & {
  intentsMap: Record<string, { name: string }>;
};

const ConnectedChoiceStep: React.FC<ConnectedChoiceStepProps> = ({ node, data, platform, intentsMap }) => {
  const [elsePortID, nodeOutPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
  const choicesByPortID = useSyncedLookup(nodeOutPorts, data.choices);

  const choices = React.useMemo(
    () =>
      nodeOutPorts
        .filter((portID) => choicesByPortID[portID])
        .map((portID) => {
          const {
            [platform]: { intent },
          } = choicesByPortID[portID];

          return {
            label: intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null,
            portID,
          };
        }),
    [platform, choicesByPortID, nodeOutPorts, intentsMap]
  );

  return <ChoiceStep choices={choices} elsePortID={elsePortID} />;
};

const mapStateToProps = {
  intentsMap: Intent.mapPlatformIntentsSelector,
};

export default connect(mapStateToProps)(ConnectedChoiceStep);
