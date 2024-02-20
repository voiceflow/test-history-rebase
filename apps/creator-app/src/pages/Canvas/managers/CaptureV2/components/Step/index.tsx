import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { useActiveProjectTypeConfig } from '@/hooks';
import Step, { NoMatchStepItemV2, NoReplyStepItemV2, Section } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext, EntityMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformSlotIntoPrompt } from '@/pages/Canvas/utils';

import { CaptureItem } from './components';
import { CaptureSlot } from './types';

const CaptureV2Step: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({ data, ports, engine, palette }) => {
  const projectConfig = useActiveProjectTypeConfig();

  const entityMap = React.useContext(EntityMapContext)!;
  const entityAndVariableMap = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const slots: CaptureSlot[] = React.useMemo(() => {
    const allSlots = data.intent?.slots.map((intentSlot) => ({
      ...intentSlot,
      slot: entityMap[intentSlot.id],
      prompt: transformSlotIntoPrompt(entityMap[intentSlot.id], intentSlot, entityMap),
    }));

    if (!allSlots?.length) return [projectConfig.utils.intent.slotFactory({ id: '' })];

    return allSlots;
  }, [projectConfig, data.intent?.slots, entityMap]);

  const onOpenEditor = () => engine.setActive(data.nodeID);

  const variableOrEntity = data.variable ? entityAndVariableMap.byKey[data.variable] : null;

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        {data.captureType === BaseNode.CaptureV2.CaptureType.QUERY ? (
          <CaptureItem
            label={
              <>
                Capture user reply{' '}
                {variableOrEntity && !variableOrEntity.isSlot && (
                  <>
                    to <Text>{`{${variableOrEntity.name}}`}</Text>
                  </>
                )}
              </>
            }
            isLast
            isFirst
            palette={palette}
            nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
            onOpenEditor={onOpenEditor}
          />
        ) : (
          slots.map((slot, index) => (
            <CaptureItem
              key={index}
              slot={slot}
              isLast={index === slots.length - 1}
              isFirst={index === 0}
              palette={palette}
              nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
              onOpenEditor={onOpenEditor}
            />
          ))
        )}

        <NoMatchStepItemV2 portID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]} noMatch={data.noMatch} nodeID={data.nodeID} nestedWithIcon />
        <NoReplyStepItemV2 portID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]} noReply={data.noReply} nodeID={data.nodeID} nestedWithIcon />
      </Section>
    </Step>
  );
};

export default CaptureV2Step;
