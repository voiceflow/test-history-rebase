import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import Step, { ConnectedStep } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import Button from './Button/Button';
import ButtonGroup from './Button/ButtonGroup';
import Image from './Image';

interface Card extends Omit<Realtime.NodeData.CardV2.Card, 'description'> {
  description: React.ReactNode;
}

export interface CardStepV2Props {
  cards: Card[];
  nodeID: string;
  palette: HSLShades;
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  byKeyPorts: Record<string, string>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CardStepV2: React.FC<CardStepV2Props> = ({ nodeID, cards, byKeyPorts }) => (
  <Step nodeID={nodeID} dividerOffset={22}>
    {cards.map((card) => (
      <Step.Section key={card.id}>
        <Step.Item>
          <Image imageUrl={isVariable(card.imageUrl) ? null : card.imageUrl} />
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
                <Step.Item key={button.id} nested portID={byKeyPorts[button.id]}>
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

const slateDescription = (description: Realtime.NodeData.CardV2.Card['description']) =>
  SlateEditable.EditorAPI.isNewState(description) ? '' : SlateEditable.serializeToJSX(description);

const ConnectedCardStepV2: ConnectedStep<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = ({ ports, data, palette }) => {
  const cards = React.useMemo(
    () =>
      data.cards.map((card) => ({
        ...card,
        title: card.title && transformVariablesToReadable(card.title),
        description: slateDescription(card.description),
        buttons: card.buttons.map((button) => ({
          ...button,
          name: button.name ? transformVariablesToReadable(button.name) : '',
        })),
      })),
    [data.cards]
  );

  return (
    <CardStepV2
      nodeID={data.nodeID}
      cards={cards}
      noMatch={data.noMatch}
      noReply={data.noReply}
      byKeyPorts={ports.out.byKey}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      palette={palette}
    />
  );
};

export default ConnectedCardStepV2;
