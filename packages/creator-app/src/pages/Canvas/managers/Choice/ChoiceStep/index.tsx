import { Models, Node } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch, useSyncedLookup } from '@/hooks';
import Step, { Attachment, ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
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
  noMatch: Realtime.NodeData.NoMatch;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  variant: BlockVariant;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ nodeID, choices, noMatch, noReply, noMatchPortID, noReplyPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      {choices.length ? (
        choices.map(({ key, label, linkedLabel, portID, attachment, onAttachmentClick }, index) => (
          <Item
            key={key}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={label}
            portID={portID}
            variant={variant}
            attachment={attachment ? <Attachment icon="clip" onClick={stopPropagation(onAttachmentClick)} /> : null}
            linkedLabel={linkedLabel}
            placeholder={attachment ? 'Create or select an intent' : `Path ${index + 1}`}
            multilineLabel
            labelLineClamp={5}
          />
        ))
      ) : (
        <Item placeholder="Add choices" icon={NODE_CONFIG.icon} variant={variant} />
      )}

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  node,
  data,
  platform,
  variant,
}) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const choicesByPortID = useSyncedLookup(node.ports.out.dynamic, data.choices);

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
      noMatch={data.else}
      noReply={data.noReply}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
      noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
      variant={variant}
    />
  );
};

export default ConnectedChoiceStep;
