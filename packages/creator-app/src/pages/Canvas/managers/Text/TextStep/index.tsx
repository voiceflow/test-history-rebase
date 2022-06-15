import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
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
  palette: HSLShades;
}

export const TextStep: React.FC<TextStepProps> = ({ items, nodeID, preview, nextPortID, palette }) => {
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
              palette={palette}
              placeholder="Add text reply"
              withNewLines
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item placeholder="Add text reply" icon={NODE_CONFIG.icon} palette={palette} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedTextStep: ConnectedStep<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({ ports, data, palette }) => {
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
      palette={palette}
    />
  );
};

export default ConnectedTextStep;
