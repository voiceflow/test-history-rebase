import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item as StepItem, Section, StepButton } from '@/pages/Canvas/components/Step';
import { ClassName } from '@/styles/constants';
import { serializeSlateToJSX, serializeSlateToText } from '@/utils/slate';

import TextPreview from '../TextPreview';
import { TextStepItem } from '../types';

export interface TextStepProps {
  items: TextStepItem[];
  itemsToRender: TextStepItem[];
  nodeID: string;
  preview: boolean;
  nextPortID: string;
  palette: HSLShades;
  onOpenEditor: () => void;
}

const TEXT_PLACEHOLDER = 'Enter text reply';

export const TextStepV2: React.FC<TextStepProps> = ({
  items,
  preview,
  nodeID,
  nextPortID,
  palette,
  onOpenEditor,
  itemsToRender: itemsWithContent,
}) => {
  const shouldRenderAttachment = itemsWithContent.length > 1 && preview;
  const itemsToRender = shouldRenderAttachment ? [items[0]] : items;

  const attachment = (
    <Popper
      placement="right-start"
      borderRadius="8px"
      renderContent={({ onClose }) => <TextPreview onClose={onClose} onOpenEditor={onOpenEditor} textVariants={itemsWithContent} />}
    >
      {({ onToggle, ref, isOpened }) => (
        <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="randomV2" isActive={isOpened} style={{ marginTop: 0, marginBottom: 0 }} />
      )}
    </Popper>
  );

  return (
    <Step nodeID={nodeID}>
      <Section v2>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, content }, index) => {
            const isLastItem = index === itemsToRender.length - 1;

            const stepLabel = content && (
              <Step.StepLabelRow>
                {content} {shouldRenderAttachment && attachment}
              </Step.StepLabelRow>
            );

            return (
              <Step.StepItemContainer key={id} className={ClassName.CANVAS_STEP_ITEM} style={{ padding: '12px 16px 12px 22px' }}>
                <Step.StepLabelTextContainer variant={stepLabel ? StepLabelVariant.PRIMARY : StepLabelVariant.PLACEHOLDER}>
                  <Step.StepLabelText multiline lineClamp={100} withNewLines className={ClassName.CANVAS_STEP_ITEM_LABEL}>
                    {stepLabel || TEXT_PLACEHOLDER}
                  </Step.StepLabelText>
                </Step.StepLabelTextContainer>
                <Step.StepPort portID={isLastItem ? nextPortID : null} />
              </Step.StepItemContainer>
            );
          })
        ) : (
          <StepItem placeholder={TEXT_PLACEHOLDER} palette={palette} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedTextStepV2: ConnectedStep<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({ ports, data, palette, engine }) => {
  const items = React.useMemo(
    () =>
      data.texts.map(({ id, content }) => ({
        id,
        text: serializeSlateToText(content),
        content: SlateEditorAPI.isNewState(content) ? '' : serializeSlateToJSX(content),
      })),
    [data.texts]
  );

  const itemsToRender = React.useMemo(() => items.filter((item) => item.content), [items]);

  return (
    <TextStepV2
      items={items}
      itemsToRender={itemsToRender}
      nodeID={data.nodeID}
      preview={data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      palette={palette}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedTextStepV2;
