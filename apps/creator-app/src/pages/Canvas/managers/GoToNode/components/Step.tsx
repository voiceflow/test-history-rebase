import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Step, { Attachment, Item, Section } from '@/pages/Canvas/components/Step';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';
import { useGoToNode } from './hooks';

const GoToNodeStep: ConnectedStep<Realtime.NodeData.GoToNode> = ({ data, palette }) => {
  const engine = React.useContext(EngineContext)!;

  const goToNode = useGoToNode(data.nodeID ?? null, data.diagramID);

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={goToNode && `Go to '${goToNode.name}'`}
          palette={palette}
          attachment={
            goToNode ? (
              <Attachment icon="clip" onClick={stopPropagation(() => engine.focusDiagramNode(data.diagramID ?? null, goToNode.nodeID))} />
            ) : null
          }
          placeholder="Select go-to block"
          multilineLabel
          labelLineClamp={5}
        />
      </Section>
    </Step>
  );
};

export default GoToNodeStep;
