import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { StepLabelVariant } from '@/constants/canvas';
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
}

export const TextStep: React.FC<TextStepProps> = ({ items, nodeID, preview, nextPortID }) => {
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
              iconColor={NODE_CONFIG.iconColor}
              placeholder="Add text reply"
              withNewLines
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item placeholder="Add text reply" icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedTextStep: ConnectedStep<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({ node, data }) => {
  const items = React.useMemo(
    () => data.texts.map(({ id, content }) => ({ id, content: SlateEditorAPI.isNewState(content) ? '' : serializeSlateToJSX(content) })),
    [data.texts]
  );

  return (
    <TextStep
      items={items}
      nodeID={node.id}
      preview={data.canvasVisibility === Node.Utils.CanvasNodeVisibility.PREVIEW}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    />
  );
};

export default ConnectedTextStep;
