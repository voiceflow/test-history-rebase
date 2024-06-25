import type * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';
import { useSyncedLookup } from '@/hooks';
import Step, { Item, Section, StepButton, SuccessItem } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import StepPreview from './StepPreview';

interface Path {
  label: string;
  portID: string;
  isDefault?: boolean;
}
export interface ActionStepProps {
  name: string;
  paths: Path[];
  nodeID: string;
  withPorts: boolean;
  palette: HSLShades;
}

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.Trace> = ({ ports, data, withPorts, palette, engine }) => {
  const pathsByPortID = useSyncedLookup(ports.out.dynamic, data.paths);

  const paths = React.useMemo(
    () =>
      ports.out.dynamic
        .filter((portID) => pathsByPortID[portID])
        .map<Path>((portID) => ({ ...pathsByPortID[portID], portID })),
    [pathsByPortID, ports.out.dynamic, data.paths]
  );

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon="action"
          palette={palette}
          label={data.name}
          placeholder="Enter custom action name"
          multilineLabel
          attachment={
            !!data.body && (
              <Popper
                placement="right-start"
                renderContent={({ onClose }) => (
                  <StepPreview data={data} onClose={onClose} onOpenEditor={() => engine.setActive(data.nodeID)} />
                )}
              >
                {({ onToggle, ref, isOpened }) => (
                  <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="preview" isActive={isOpened} />
                )}
              </Popper>
            )
          }
        />
      </Section>

      {withPorts && (
        <Section>
          {paths.map((path) => {
            const Container = path.isDefault ? SuccessItem : Item;

            return (
              <Container
                key={path.portID}
                label={path.label}
                placeholder="Enter path name"
                portID={path.portID}
                multilineLabel
              />
            );
          })}
        </Section>
      )}
    </Step>
  );
};

export default ConnectedActionStep;
