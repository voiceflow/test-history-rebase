import { CanvasNodeVisibility } from '@voiceflow/general-types';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

interface TextStepItem {
  id: string;
  content: string;
}

export interface TextStepProps {
  items: TextStepItem[];
  portID: string;
  nodeID: string;
  preview: boolean;
}

export const TextStep: React.FC<TextStepProps> = ({ items, nodeID, portID, preview }) => {
  const itemsToRender = preview && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, content }, index) => (
            <Item
              key={id}
              label={content ? transformVariablesToReadable(content) : null}
              portID={index === itemsToRender.length - 1 ? portID : null}
              icon={NODE_CONFIG.icon}
              iconColor={NODE_CONFIG.iconColor}
              placeholder="What will assistant reply?"
              withNewLines
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              labelLineClamp={100}
            />
          ))
        ) : (
          <Item placeholder="What will assistant reply?" icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedTextStep: React.FC<ConnectedStepProps<NodeData.Text>> = ({ node, data }) => {
  const items = React.useMemo(() => data.texts.map(({ id, content }) => ({ id, content: SlateEditorAPI.serialize(content) })), [data.texts]);

  return <TextStep items={items} preview={data.canvasVisibility === CanvasNodeVisibility.PREVIEW} nodeID={node.id} portID={node.ports.out[0]} />;
};

export default ConnectedTextStep;
