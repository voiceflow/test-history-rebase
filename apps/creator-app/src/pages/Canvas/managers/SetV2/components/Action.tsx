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

  const previews = React.useMemo(
    () =>
      data.sets.reduce<Array<{ id: string; variable: { id: string; name: string }; expression: string }>>((acc, set) => {
        if (!set.variable) return acc;

        const variable = entitiesAndVariables.byKey[set.variable];

        if (!variable) return acc;

        return [
          ...acc,
          { id: set.id, variable, expression: transformVariablesToReadable(String(set.expression) || "''", entitiesAndVariables.byKey) },
        ];
      }, []),
    [data.sets, entitiesAndVariables]
  );

  const isEmpty = !previews.length;
  const firstPreview = previews[0];

  return (
    <Popper
      placement="top-start"
      modifiers={{ preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } } }}
      renderContent={({ onClose }) => <ActionPreview sets={previews} onClose={onClose} onRemove={onRemove} onOpenEditor={onOpenEditor} />}
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
              {!firstPreview?.variable ? 'Set variable' : data.name || `Set {${firstPreview.variable.name}} to ${firstPreview.expression}`}
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
