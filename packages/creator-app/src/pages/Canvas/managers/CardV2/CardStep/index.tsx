import { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import Step, { ConnectedStep } from '@/pages/Canvas/components/Step';

import Button from './Button/Button';
import ButtonGroup from './Button/ButtonGroup';
import Image from './Image';

export interface CardStepV2Props {
  nodeID: string;
  variant: BlockVariant;

  cards: BaseNode.CardV2.Card[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CardStepV2: React.FC<CardStepV2Props> = ({ nodeID, cards }) => (
  <Step nodeID={nodeID} dividerOffset={22}>
    {cards.map((card) => (
      <Step.Section key={card.id}>
        <Step.Item>
          <Image imageUrl={card.imageUrl} />
          <Step.LabelTextContainer>
            <Step.LabelText>{card.title || 'Card Title'}</Step.LabelText>
            <Step.SubLabelText variant={card.description ? Step.StepLabelVariant.PRIMARY : Step.StepLabelVariant.PLACEHOLDER}>
              {card.description || 'Card description'}
            </Step.SubLabelText>
          </Step.LabelTextContainer>
        </Step.Item>

        {!!card.buttons?.length && (
          <Step.SubItem>
            <ButtonGroup>
              {card.buttons.map((button) => (
                <Step.Item key={button.id} nested>
                  <Button>{button.name || 'Button Label'}</Button>
                </Step.Item>
              ))}
            </ButtonGroup>
          </Step.SubItem>
        )}
      </Step.Section>
    ))}
  </Step>
);

const ConnectedCardStepV2: ConnectedStep<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = ({ ports, data, variant }) => {
  return (
    <CardStepV2
      nodeID={data.nodeID}
      cards={data.cards}
      noMatch={data.noMatch}
      noReply={data.noReply}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      variant={variant}
    />
  );
};

export default ConnectedCardStepV2;
