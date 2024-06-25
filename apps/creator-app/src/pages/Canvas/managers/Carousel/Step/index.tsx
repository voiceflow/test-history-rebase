import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
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
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';
import { isDialogflowPlatform } from '@/utils/typeGuards';

import { PATH } from '../Editor/Buttons/constants';

const CarouselStep: ConnectedStep<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = ({
  ports,
  data,
  isLast,
  platform,
}) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const cards = React.useMemo(
    () =>
      data.cards.map((card) => ({
        ...card,
        title: card.title && transformVariablesToReadable(card.title, entitiesAndVariables.byKey),
        buttons: card.buttons.map((button) => ({
          ...button,
          name: button.name ? transformVariablesToReadable(button.name, entitiesAndVariables.byKey) : '',
        })),
        description: SlateEditable.serializeToJSX(card.description, { variablesMap: entitiesAndVariables.byKey }),
      })),
    [data.cards, entitiesAndVariables.byKey]
  );

  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];
  const noReplyPortID = ports.out.builtIn[BaseModels.PortType.NO_REPLY];

  const isDF = isDialogflowPlatform(platform);

  return (
    <Step nodeID={data.nodeID} dividerOffset={22}>
      {cards.map((card) => (
        <Step.Section key={card.id}>
          <Step.Item portID={isDF ? ports.out.byKey[card.buttons[0]?.id] : undefined}>
            <Thumbnail src={isVariable(card.imageUrl) ? null : card.imageUrl} mr={16} />
            <Step.LabelTextContainer>
              <Step.LabelText>{card.title || 'Card title'}</Step.LabelText>
              <Step.SubLabelText
                variant={card.description ? Step.StepLabelVariant.SECONDARY : Step.StepLabelVariant.PLACEHOLDER}
              >
                {card.description || 'Card description'}
              </Step.SubLabelText>
            </Step.LabelTextContainer>
          </Step.Item>

          {!isDF && !!card.buttons?.length && (
            <Step.SubItem>
              <StepCarouselButtonGroup>
                {card.buttons.map((button) => (
                  <Step.Item
                    key={button.id}
                    nested
                    portID={ports.out.byKey[button.id]}
                    parentActionsPath={PATH}
                    parentActionsParams={{ buttonID: button.id }}
                  >
                    <StepCarouselButton>
                      <OverflowText>{button.name || 'Button Label'}</OverflowText>
                    </StepCarouselButton>
                  </Step.Item>
                ))}
              </StepCarouselButtonGroup>
            </Step.SubItem>
          )}
        </Step.Section>
      ))}

      {isLast && (
        <NoMatchNoReplyContainer>
          <NoMatchStepItemV2 nodeID={data.nodeID} portID={noMatchPortID} noMatch={data.noMatch} />
          <NoReplyStepItemV2 nodeID={data.nodeID} portID={noReplyPortID} noReply={data.noReply} />
        </NoMatchNoReplyContainer>
      )}
    </Step>
  );
};

export default CarouselStep;
