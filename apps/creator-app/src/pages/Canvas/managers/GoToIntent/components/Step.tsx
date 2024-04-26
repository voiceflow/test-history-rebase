import type * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Step, { Attachment, Item, Section } from '@/pages/Canvas/components/Step';
import { EngineContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';
import { useGoToIntentMeta } from './hooks';

const GoToIntentStep: ConnectedStep<Realtime.NodeData.GoToIntent> = ({ data, palette }) => {
  const engine = React.useContext(EngineContext)!;

  const { goToIntentName, goToNodeID, goToDiagram } = useGoToIntentMeta(data.intent ?? null, data.diagramID);

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={goToIntentName && `Go to '${goToIntentName}'`}
          palette={palette}
          attachment={
            goToNodeID ? (
              <Attachment
                icon="clip"
                onClick={stopPropagation(() => engine.focusDiagramNode(goToDiagram?.id ?? null, goToNodeID))}
              />
            ) : null
          }
          placeholder="Select go-to intent"
          multilineLabel
          labelLineClamp={5}
        />
      </Section>
    </Step>
  );
};

export default GoToIntentStep;
