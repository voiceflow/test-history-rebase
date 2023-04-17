import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, NoMatchStepItemV2, NoReplyStepItemV2, Section } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';

import { ConnectedStep } from '../../../types';
import { ChoiceItem } from './components';
import { useChoiceStep } from './hooks';

const ChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({ data, ports, engine, palette }) => {
  const { choices } = useChoiceStep({ data, ports });

  const onOpenEditor = () => engine.setActive(data.nodeID);

  return (
    <Step nodeID={data.nodeID}>
      <Section v2 withIcon>
        {choices.length > 1 || (choices.length === 1 && choices[0].label) ? (
          choices.map((item, index) => <ChoiceItem {...item} key={item.key} index={index} palette={palette} onOpenEditor={onOpenEditor} />)
        ) : (
          <Item v2 label={WAITING_FOR_INTENT_PLACEHOLDER} icon="radar" palette={palette} />
        )}

        <NoMatchStepItemV2 nodeID={data.nodeID} portID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]} noMatch={data.noMatch} nestedWithIcon />
        <NoReplyStepItemV2 nodeID={data.nodeID} portID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]} noReply={data.noReply} nestedWithIcon />
      </Section>
    </Step>
  );
};

export default ChoiceStep;
