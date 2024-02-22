import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
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
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const setsToPreview = React.useMemo(() => data.sets.filter((set) => set.variable), [data.sets]);
  const firstStep = setsToPreview[0];

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
              {!firstStep?.variable
                ? 'Set variable'
                : data.name ||
                  `Set {${entitiesAndVariables.byKey[firstStep.variable]?.name ?? firstStep.variable}} to ${transformVariablesToReadable(
                    String(firstStep.expression) || "''",
                    entitiesAndVariables.byKey
                  )}`}
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
