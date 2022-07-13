import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
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

  const itemsWithContent = React.useMemo(() => items.filter((item) => item.text), [items]);

  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        {data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.ALL_VARIANTS ? (
          items.map(({ id, content }, index) => (
            <Item
              v2
              key={id}
              label={content}
              portID={index === items.length - 1 ? nextPortID : null}
              palette={palette}
              placeholder="Add text reply"
              withNewLines
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item
            v2
            label={items[0].content}
            portID={nextPortID}
            palette={palette}
            placeholder={TEXT_PLACEHOLDER}
            withNewLines
            multilineLabel
            labelLineClamp={100}
            newLineAttachment={
              itemsWithContent.length > 1 && (
                <Popper
                  placement="right-start"
                  borderRadius="8px"
                  renderContent={({ onClose }) => (
                    <TextPreview onClose={onClose} onOpenEditor={() => engine.setActive(data.nodeID)} textVariants={items} />
                  )}
                >
                  {({ onToggle, ref, isOpened }) => (
                    <StepButton
                      ref={ref}
                      icon="randomV2"
                      style={{ marginTop: 0, marginBottom: 0 }}
                      onClick={stopPropagation(onToggle)}
                      isActive={isOpened}
                    />
                  )}
                </Popper>
              )
            }
          />
        )}
      </Section>
    </Step>
  );
};

export default ConnectedTextStepV2;
