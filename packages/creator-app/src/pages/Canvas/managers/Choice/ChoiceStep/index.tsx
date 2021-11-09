import { Node } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch, useSyncedLookup } from '@/hooks';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';
import { getDistinctPlatformValue } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

interface ChoiceItem {
  label: Nullable<string>;
  portID: Nullable<string>;
  attachment?: boolean;
  linkedLabel?: Nullable<string>;
  onAttachmentClick?: VoidFunction;
}

export interface ChoiceStepProps {
  isPath: boolean;
  choices: ChoiceItem[];
  nodeID: string;
  elsePortID: string;
  elsePathName: string;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ isPath, choices, nodeID, elsePortID, elsePathName }) => (
  <Step nodeID={nodeID}>
    {!!choices.length && (
      <Section>
        {choices.map(({ label, linkedLabel, portID, attachment, onAttachmentClick }, index) => (
          <Item
            key={portID}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={label}
            portID={portID}
            iconColor={NODE_CONFIG.iconColor}
            attachment={attachment}
            linkedLabel={linkedLabel}
            placeholder={attachment ? 'Create or select an intent' : `Path ${index + 1}`}
            multilineLabel
            labelLineClamp={5}
            onAttachmentClick={onAttachmentClick}
          />
        ))}
      </Section>
    )}

    {isPath ? (
      <ElseItem label={elsePathName} portID={elsePortID} />
    ) : (
      choices.length === 0 && (
        <Section>
          <Item icon="else" iconColor="#6e849a" portID={null} label="Reprompt" labelVariant={StepLabelVariant.SECONDARY} />
        </Section>
      )
    )}
  </Step>
);

const ConnectedChoiceStep: React.FC<ConnectedStepProps<Realtime.NodeData.Interaction>> = ({ node, data, platform }) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const [elsePortID, nodeOutPorts] = React.useMemo(() => Utils.array.head(node.ports.out), [node.ports.out]);
  const choicesByPortID = useSyncedLookup(nodeOutPorts, data.choices);
  const isPath = !!data.else.type && data.else.type !== Node.Utils.NoMatchType.REPROMPT;

  const choices = React.useMemo(
    () =>
      nodeOutPorts
        .filter((portID) => choicesByPortID[portID])
        .map<ChoiceItem>((portID) => {
          const { goTo, intent, action } = getDistinctPlatformValue(platform, choicesByPortID[portID]);

          const isPath = action === Node.Interaction.ChoiceAction.PATH;
          const goToIntent = goTo?.intentID && intentsMap[goTo.intentID] ? intentsMap[goTo.intentID] ?? null : null;

          return {
            label: intent && intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null,
            portID: isPath ? portID : null,
            // TODO: uncomment when the go to specific intent step id will be implemented
            // attachment: !isPath && !!goToIntent,
            linkedLabel: isPath ? null : prettifyIntentName(goToIntent?.name),
            onAttachmentClick: () => goToIntent && goToInteractionModelEntity(InteractionModelTabType.INTENTS, goToIntent.id),
          };
        }),
    [platform, choicesByPortID, nodeOutPorts, intentsMap]
  );

  return <ChoiceStep choices={choices} nodeID={node.id} elsePortID={elsePortID} isPath={isPath} elsePathName={data.else.pathName} />;
};

export default ConnectedChoiceStep;
