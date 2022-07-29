import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowText, Thumbnail } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import Step, {
  NoMatchNoReplyContainer,
  NoMatchStepItemV2,
  NoReplyStepItemV2,
  StepCarouselButton,
  StepCarouselButtonGroup,
} from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

const slateDescription = (description: Realtime.NodeData.CardV2.Card['description']) =>
  SlateEditable.EditorAPI.isNewState(description) ? '' : SlateEditable.serializeToJSX(description);

const CardV2Step: ConnectedStep<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = ({ ports, data, isLast }) => {
  const card = React.useMemo(
    () => ({
      ...data.card,
      title: data.card.title && transformVariablesToReadable(data.card.title),
      description: slateDescription(data.card.description),
      buttons: data.card.buttons.map((button) => ({
        ...button,
        name: button.name ? transformVariablesToReadable(button.name) : '',
      })),
    }),
    [data.card]
  );

  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];
  const noReplyPortID = ports.out.builtIn[BaseModels.PortType.NO_REPLY];

  return (
    <Step nodeID={data.nodeID} dividerOffset={22}>
      <Step.Section key={card.id}>
        <Step.Item>
          <Thumbnail src={isVariable(card.imageUrl) ? null : card.imageUrl} mr={16} />
          <Step.LabelTextContainer>
            <Step.LabelText>{card.title || 'Card title'}</Step.LabelText>
            <Step.SubLabelText variant={card.description ? Step.StepLabelVariant.SECONDARY : Step.StepLabelVariant.PLACEHOLDER}>
              {card.description || 'Card description'}
            </Step.SubLabelText>
          </Step.LabelTextContainer>
        </Step.Item>

        {!!card.buttons?.length && (
          <Step.SubItem>
            <StepCarouselButtonGroup>
              {card.buttons.map((button) => (
                <Step.Item key={button.id} nested portID={ports.out.byKey[button.id]}>
                  <StepCarouselButton>
                    <OverflowText>{button.name || 'Button Label'}</OverflowText>
                  </StepCarouselButton>
                </Step.Item>
              ))}
            </StepCarouselButtonGroup>
          </Step.SubItem>
        )}
      </Step.Section>

      {isLast && (
        <NoMatchNoReplyContainer>
          <NoMatchStepItemV2 nodeID={data.nodeID} portID={noMatchPortID} noMatch={data.noMatch} />
          <NoReplyStepItemV2 nodeID={data.nodeID} portID={noReplyPortID} noReply={data.noReply} />
        </NoMatchNoReplyContainer>
      )}
    </Step>
  );
};

export default CardV2Step;
