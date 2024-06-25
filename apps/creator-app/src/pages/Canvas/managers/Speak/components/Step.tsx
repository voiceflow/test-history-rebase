import { BaseModels, BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import AudioStep from './AudioStep';
import { isVoiceItem } from './utils';
import VoiceStep from './VoiceStep';

const SpeakStep: ConnectedStep<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = ({
  data,
  ports,
  engine,
  palette,
}) => {
  const attachmentItems = React.useMemo(
    () => data.dialogs.filter((item) => (isVoiceItem(item) ? item.content : item.url)),
    [data.dialogs]
  );

  const onOpenEditor = () => engine.setActive(data.nodeID);

  const previewMode = !data.canvasVisibility
    ? data.randomize
    : data.canvasVisibility === BaseNode.Utils.CanvasNodeVisibility.PREVIEW;
  const itemsToRender = previewMode && data.dialogs.length ? [data.dialogs[0]] : data.dialogs;

  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        {itemsToRender.length ? (
          itemsToRender.map((item, index) => {
            const sharedProps = {
              key: item.id,
              palette,
              nextPortID: index === itemsToRender.length - 1 ? nextPortID : null,
              onOpenEditor,
              attachmentItems: previewMode && attachmentItems.length > 1 ? attachmentItems : [],
            };

            return isVoiceItem(item) ? (
              <VoiceStep {...sharedProps} item={item} />
            ) : (
              <AudioStep {...sharedProps} item={item} />
            );
          })
        ) : (
          <Item placeholder="Enter speak reply" palette={palette} />
        )}
      </Section>
    </Step>
  );
};

export default SpeakStep;
