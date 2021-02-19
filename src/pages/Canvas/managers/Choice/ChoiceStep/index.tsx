import { ElseType as InteractionElseType } from '@voiceflow/general-types/build/nodes/interaction';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps } from '@/types';
import { head } from '@/utils/array';
import { prettifyIntentName } from '@/utils/intent';

export type ChoiceStepProps = {
  isPath: boolean;
  choices: { label: string | null; portID: string }[];
  elsePortID: string;
};

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ isPath, choices, elsePortID }) => (
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
    {isPath && <ElseItem portID={elsePortID} />}
    {!isPath && choices.length === 0 && (
      <Section>
        <Item icon="else" iconColor="#6e849a" portID={null} label="Reprompt" labelVariant={StepLabelVariant.SECONDARY} />
      </Section>
    )}
  </Step>
);

const ConnectedChoiceStep: React.FC<ConnectedStepProps<NodeData.Interaction> & ConnectedChoiceStepProps> = ({ node, data, platform, intentsMap }) => {
  const [elsePortID, nodeOutPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
  const choicesByPortID = useSyncedLookup(nodeOutPorts, data.choices);
  const isPath = data.else.type === InteractionElseType.PATH;

  const choices = React.useMemo(
    () =>
      nodeOutPorts
        .filter((portID) => choicesByPortID[portID])
        .map((portID) => {
          const {
            [platform]: { intent },
          } = choicesByPortID[portID];

          return {
            label: intentsMap[intent!] ? prettifyIntentName(intentsMap[intent!].name) : null,
            portID,
          };
        }),
    [platform, choicesByPortID, nodeOutPorts, intentsMap]
  );

  return <ChoiceStep choices={choices} elsePortID={elsePortID} isPath={isPath} />;
};

const mapStateToProps = {
  intentsMap: Intent.mapPlatformIntentsSelector,
};

type ConnectedChoiceStepProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectedChoiceStep) as React.FC<ConnectedStepProps<NodeData.Interaction>>;
