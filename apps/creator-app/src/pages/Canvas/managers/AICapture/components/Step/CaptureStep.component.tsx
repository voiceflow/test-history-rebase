import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, NoReplyStepItemV2, Section } from '@/pages/Canvas/components/Step';
import { EntityMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { CaptureItem } from './CaptureItem.component';

const AICaptureStep: ConnectedStep<Realtime.NodeData.AICapture, Realtime.NodeData.AICaptureBuiltInPorts> = ({ data, ports, engine, palette }) => {
  const entityMap = React.useContext(EntityMapContext)!;

  const entities = React.useMemo(() => data.entities.map((entityID) => entityMap[entityID]), [data.entities, entityMap]);

  const onOpenEditor = () => engine.setActive(data.nodeID);

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        {entities.map((entity, index) => (
          <CaptureItem
            key={index}
            entity={entity}
            isLast={index === entities.length - 1}
            isFirst={index === 0}
            palette={palette}
            nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
            onOpenEditor={onOpenEditor}
          />
        ))}

        {!!data.exitScenerios.length && data.exitPath && (
          <Item nestedWithIcon label="Exit scenerio" v2 palette={palette} portID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]} />
        )}

        <NoReplyStepItemV2 portID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]} noReply={data.noReply} nodeID={data.nodeID} nestedWithIcon />
      </Section>
    </Step>
  );
};

export default AICaptureStep;
