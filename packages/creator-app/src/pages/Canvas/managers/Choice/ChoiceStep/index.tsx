import { Models, Node } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch, useSyncedLookup } from '@/hooks';
import Step, { ConnectedStep, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';
import { getDistinctPlatformValue } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

interface ChoiceItem {
  key: string;
  label: Nullable<string>;
  portID: Nullable<string>;
  attachment?: boolean;
  linkedLabel?: Nullable<string>;
  onAttachmentClick?: VoidFunction;
}

export interface ChoiceStepProps {
  nodeID: string;
  choices: ChoiceItem[];
  noMatchPortID: string;
  withNoMatchPath: boolean;
  noMatchPathName: string;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ nodeID, choices, noMatchPortID, withNoMatchPath, noMatchPathName }) => (
  <Step nodeID={nodeID}>
    {!!choices.length && (
      <Section>
        {choices.map(({ key, label, linkedLabel, portID, attachment, onAttachmentClick }, index) => (
          <Item
            key={key}
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

    {withNoMatchPath ? (
      <ElseItem label={noMatchPathName} portID={noMatchPortID} />
    ) : (
      choices.length === 0 && (
        <Section>
          <Item icon="else" iconColor="#6e849a" portID={null} label="Reprompt" labelVariant={StepLabelVariant.SECONDARY} />
        </Section>
      )
    )}
  </Step>
);

const ConnectedChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({ node, data, platform }) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const choicesByPortID = useSyncedLookup(node.ports.out.dynamic, data.choices);

  const withNoMatchPath = !!data.else.type && data.else.type !== Node.Utils.NoMatchType.REPROMPT;

  const choices = React.useMemo(
    () =>
      node.ports.out.dynamic
        .filter((portID) => choicesByPortID[portID])
        .map<ChoiceItem>((portID) => {
          const { id, goTo, intent, action } = getDistinctPlatformValue(platform, choicesByPortID[portID]);

          const isPath = action === Node.Interaction.ChoiceAction.PATH;
          const goToIntent = goTo?.intentID && intentsMap[goTo.intentID] ? intentsMap[goTo.intentID] ?? null : null;

          return {
            key: id,
            label: intent && intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null,
            portID: isPath ? portID : null,
            // TODO: uncomment when the go to specific intent step id will be implemented
            // attachment: !isPath && !!goToIntent,
            linkedLabel: isPath ? null : prettifyIntentName(goToIntent?.name),
            onAttachmentClick: () => goToIntent && goToInteractionModelEntity(InteractionModelTabType.INTENTS, goToIntent.id),
          };
        }),
    [platform, choicesByPortID, intentsMap, node.ports.out.dynamic]
  );

  return (
    <ChoiceStep
      nodeID={node.id}
      choices={choices}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
      withNoMatchPath={withNoMatchPath}
      noMatchPathName={data.else.pathName}
    />
  );
};

export default ConnectedChoiceStep;
