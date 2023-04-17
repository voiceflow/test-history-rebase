import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { transformVariablesToReadable } from '@/utils/slot';

import Step from '../../../components/Step';
import { ConnectedAction } from '../../types';
import { NODE_CONFIG } from '../constants';
import ActionPreview from './ActionPreview';

const Action: ConnectedAction<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
}) => {
  const setsToPreview = React.useMemo(() => data.sets.filter((set) => set.variable), [data.sets]);

  const isEmpty = !setsToPreview.length;

  return (
    <Popper
      placement="top-start"
      renderContent={({ onClose }) => <ActionPreview sets={setsToPreview} onClose={onClose} onRemove={onRemove} onOpenEditor={onOpenEditor} />}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={
            <TippyTooltip tag="div" content="Variable is missing" disabled={!isEmpty || isActive} offset={[0, 2]}>
              <Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : NODE_CONFIG.icon!} />
            </TippyTooltip>
          }
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={
            <Canvas.Action.Label secondary={isEmpty}>
              {isEmpty
                ? 'Set variable'
                : data.name || `Set {${setsToPreview[0].variable}} to ${transformVariablesToReadable(String(setsToPreview[0].expression) || "''")}`}
            </Canvas.Action.Label>
          }
          nodeID={data.nodeID}
          active={isOpened || isActive}
          onClick={swallowEvent(onToggle)}
          reversed={reversed}
        />
      )}
    </Popper>
  );
};

export default Action;
