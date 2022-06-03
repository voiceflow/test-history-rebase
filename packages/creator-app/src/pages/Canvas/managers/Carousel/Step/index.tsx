import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowText } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import Step, { ConnectedStep, NoMatchItem, NoReplyItem } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import Image from './Image';
import * as S from './styles';

const slateDescription = (description: Realtime.NodeData.Carousel.Card['description']) =>
  SlateEditable.EditorAPI.isNewState(description) ? '' : SlateEditable.serializeToJSX(description);

const CarouselStep: ConnectedStep<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = ({ ports, data }) => {
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

  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];
  const noReplyPortID = ports.out.builtIn[BaseModels.PortType.NO_REPLY];

  return (
    <Step nodeID={data.nodeID} dividerOffset={22}>
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
                  <Step.Item key={button.id} nested portID={ports.out.byKey[button.id]}>
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
        <NoMatchItem portID={noMatchPortID} noMatch={data.noMatch} />
        <NoReplyItem portID={noReplyPortID} noReply={data.noReply} />
      </S.NoMatchNoReplySection>
    </Step>
  );
};

export default CarouselStep;
