import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Tokens } from '@voiceflow/ui-next/styles';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { SetV3StepItem } from './SetV3StepItem/SetV3StepItem.component';

interface StepItem {
  id: string;
  content: React.ReactElement;
}

export const SetV3Step: ConnectedStep<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({
  ports,
  withPorts,
  data,
  palette,
}) => {
  const error = React.useMemo(
    () => data.sets.some(({ variable, expression }) => !variable || !expression),
    [data.sets]
  );

  const items = React.useMemo(
    () =>
      data.sets.map<StepItem>((item, index) => {
        return {
          id: item.id,
          content: <SetV3StepItem item={item} withPort={withPorts && index === data.sets.length - 1} />,
        };
      }),
    [withPorts, data.sets]
  );

  return (
    <Step nodeID={data.nodeID}>
      <Section v2 noBorder>
        {!items.length && (
          <Item
            v2
            noDivider
            icon={'setV2'}
            key={0}
            palette={palette}
            placeholder="Set variable"
            labelVariant={StepLabelVariant.PRIMARY}
            portID={withPorts ? ports.out.builtIn[BaseModels.PortType.NEXT] : null}
            multilineLabel
            wordBreak
            labelLineClamp={4}
          />
        )}
        {items.map(({ id, content }, index) =>
          index === 0 ? (
            <Item
              v2
              noDivider
              icon={error ? 'warning' : 'setV2'}
              iconColor={error ? Tokens.colors.alert.alert700 : Tokens.colors.neutralDark.neutralsDark100}
              key={id}
              label={content}
              palette={palette}
              placeholder="Set variable"
              labelVariant={StepLabelVariant.PRIMARY}
              portID={index === items.length - 1 && withPorts ? ports.out.builtIn[BaseModels.PortType.NEXT] : null}
              multilineLabel
              wordBreak
              labelLineClamp={4}
            />
          ) : (
            <Item
              v2
              noDivider
              nestedWithIcon
              key={id}
              label={content}
              portID={index === items.length - 1 && withPorts ? ports.out.builtIn[BaseModels.PortType.NEXT] : null}
              palette={palette}
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              wordBreak
              labelLineClamp={4}
            />
          )
        )}
      </Section>
    </Step>
  );
};
