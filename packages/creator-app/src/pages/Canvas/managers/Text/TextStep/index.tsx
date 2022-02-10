import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { serializeSlateToJSX } from '@/utils/slate';

import { NODE_CONFIG } from '../constants';

interface TextStepItem {
  id: string;
  content: React.ReactNode;
}

export interface TextStepProps {
  items: TextStepItem[];
  nodeID: string;
  preview: boolean;
  nextPortID: string;
  variant: BlockVariant;
}

export const TextStep: React.FC<TextStepProps> = ({ items, nodeID, preview, nextPortID, variant }) => {
  const itemsToRender = preview && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, content }, index) => (
            <Item
              key={id}
              icon={NODE_CONFIG.icon}
              label={content}
              portID={index === itemsToRender.length - 1 ? nextPortID : null}
              variant={variant}
              placeholder="Add text reply"
              withNewLines
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item placeholder="Add text reply" icon={NODE_CONFIG.icon} variant={variant} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedTextStep: ConnectedStep<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({ ports, data, variant }) => {
  const items = React.useMemo(
    () => data.texts.map(({ id, content }) => ({ id, content: SlateEditorAPI.isNewState(content) ? '' : serializeSlateToJSX(content) })),
    [data.texts]
  );

  return (
    <TextStep
      items={items}
      nodeID={data.nodeID}
      preview={data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      variant={variant}
    />
  );
};

export default ConnectedTextStep;
