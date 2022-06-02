import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowText } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import Step, { ConnectedStep, NoMatchItem, NoReplyItem } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import Image from './Image';
import * as S from './styles';

interface Card extends Omit<Realtime.NodeData.CardV2.Card, 'description'> {
  description: React.ReactNode;
}
export interface CardV2StepProps {
  cards: Card[];
  palette: HSLShades;
  nodeID: string;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  byKeyPorts: Record<string, string>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CardV2Step: React.FC<CardV2StepProps> = ({ nodeID, cards, noMatch, byKeyPorts, noReply, noMatchPortID, noReplyPortID }) => (
  <Step nodeID={nodeID} dividerOffset={22}>
    {cards.map((card) => (
      <Step.Section key={card.id}>
        <Step.Item>
          <Image imageUrl={isVariable(card.imageUrl) ? null : card.imageUrl} />
          <Step.LabelTextContainer>
            <Step.LabelText>{card.title || 'Card title'}</Step.LabelText>
            <Step.SubLabelText variant={card.description ? Step.StepLabelVariant.SECONDARY : Step.StepLabelVariant.PLACEHOLDER}>
              {card.description || 'Card description'}
            </Step.SubLabelText>
          </Step.LabelTextContainer>
        </Step.Item>

        {!!card.buttons?.length && (
          <Step.SubItem>
            <S.ButtonGroup>
              {card.buttons.map((button) => (
                <Step.Item key={button.id} nested portID={byKeyPorts[button.id]}>
                  <S.Button>
                    <OverflowText>{button.name || 'Button Label'}</OverflowText>
                  </S.Button>
                </Step.Item>
              ))}
            </S.ButtonGroup>
          </Step.SubItem>
        )}
      </Step.Section>
    ))}
    <S.NoMatchNoReplySection>
      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </S.NoMatchNoReplySection>
  </Step>
);

const slateDescription = (description: Realtime.NodeData.CardV2.Card['description']) =>
  SlateEditable.EditorAPI.isNewState(description) ? '' : SlateEditable.serializeToJSX(description);

const ConnectedCardV2Step: ConnectedStep<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = ({ ports, data, palette }) => {
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
    <CardV2Step
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

export default ConnectedCardV2Step;
