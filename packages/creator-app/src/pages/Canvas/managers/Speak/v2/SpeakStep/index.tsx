import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { DialogType } from '@/constants';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyBucketURL } from '@/utils/audio';

import { getDialogStepComponent } from './constants';
import { SpeakStepProps } from './types';

export const SpeakStep: React.FC<SpeakStepProps> = ({ items, random, platform, nodeID, nextPortID, variant, onOpenEditor }) => {
  const itemsToRender = random && items.length ? [items[0]] : items;

  return (
    <Step nodeID={nodeID}>
      <Section v2>
        {itemsToRender.length ? (
          itemsToRender.map(({ id, type, ...props }, index) => {
            const DialogComponent = getDialogStepComponent(type);

            return (
              <DialogComponent
                key={id}
                id={id}
                type={type}
                items={items}
                random={random}
                platform={platform}
                nodeID={nodeID}
                nextPortID={nextPortID}
                variant={variant}
                isLastItem={index === itemsToRender.length - 1}
                onOpenEditor={onOpenEditor}
                {...props}
              />
            );
          })
        ) : (
          <Item placeholder="Enter speak reply" variant={variant} />
        )}
      </Section>
    </Step>
  );
};

const ConnectedSpeakStep: ConnectedStep<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = ({
  ports,
  data,
  platform,
  variant,
  engine,
}) => {
  const items = data.dialogs.map((item) => ({
    id: item.id,
    type: item.type,
    content: item.type === DialogType.AUDIO ? prettifyBucketURL(item.url) : item.content,
    url: item.type === DialogType.AUDIO ? item.url : undefined,
  }));

  return (
    <SpeakStep
      items={items}
      random={!data.canvasVisibility ? data.randomize : data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW}
      nodeID={data.nodeID}
      platform={platform}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      variant={variant}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedSpeakStep;
