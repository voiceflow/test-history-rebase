import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, NoMatchStepItemV2, NoReplyStepItemV2, Section } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { ButtonItem } from './components';
import { useButtons } from './hooks';

const ButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({
  ports,
  data,
  palette,
  engine,
}) => {
  const { buttons } = useButtons({ ports, data });

  const onOpenEditor = () => engine.setActive(data.nodeID);

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        {buttons.length > 1 || (buttons.length === 1 && (buttons[0].name || buttons[0].intent)) ? (
          buttons.map((button, index) => (
            <ButtonItem {...button} key={button.id} index={index} palette={palette} onOpenEditor={onOpenEditor} />
          ))
        ) : (
          <Item v2 label={WAITING_FOR_INTENT_PLACEHOLDER} icon="radar" palette={palette} />
        )}

        <NoMatchStepItemV2
          nodeID={data.nodeID}
          portID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
          noMatch={data.noMatch}
          nestedWithIcon
        />
        <NoReplyStepItemV2
          nodeID={data.nodeID}
          portID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
          noReply={data.noReply}
          nestedWithIcon
        />
      </Section>
    </Step>
  );
};

export default ButtonsStep;
