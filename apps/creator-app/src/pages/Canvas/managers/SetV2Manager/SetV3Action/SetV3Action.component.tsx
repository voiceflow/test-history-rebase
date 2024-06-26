import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Canvas, Popper, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

import Step from '../../../components/Step';
import type { ConnectedAction } from '../../types';
import { SETV2_NODE_CONFIG } from '../SetV2Manager.constant';
import { expressionToString } from '../SetV3.util';
import { SetV3ActionPreview } from './SetV3ActionPreview.component';

export const SetV3Action: ConnectedAction<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({
  data,
  ports,
  onRemove,
  reversed,
  isActive,
  onOpenEditor,
}) => {
  const variablesMapByName = useSelector(Designer.Variable.selectors.mapByName);
  const variablesMap = useSelector(Designer.Variable.selectors.map);

  const previews = React.useMemo(
    () =>
      data.sets.reduce<
        Array<{ id: string; variable: { id: string; name: string } | null; expression: string; label: string }>
      >((acc, set) => {
        const variable = set.variable ? variablesMap[set.variable] : null;

        return [
          ...acc,
          {
            id: set.id,
            variable,
            expression: expressionToString(String(set.expression), variablesMapByName),
            label: set.label || '',
          },
        ];
      }, []),
    [data.sets, variablesMap]
  );

  const isEmpty = !previews.length;
  const firstPreview = previews[0];

  const getLabel = () => {
    if (firstPreview?.label) return firstPreview.label;

    if (!firstPreview?.variable && !firstPreview?.expression) return 'Set variable';

    if (!firstPreview?.expression) return `Set {${firstPreview?.variable?.name}} to...`;

    if (!firstPreview?.variable) return `Set variable to ${firstPreview?.expression}`;

    return `Set {${firstPreview?.variable?.name}} to ${firstPreview?.expression}`;
  };

  return (
    <Popper
      placement="top-start"
      modifiers={{ preventOverflow: { padding: { top: 72, bottom: 16, left: 16, right: 16 } } }}
      renderContent={({ onClose }) => (
        <SetV3ActionPreview sets={previews} onClose={onClose} onRemove={onRemove} onOpenEditor={onOpenEditor} />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Canvas.Action
          ref={ref}
          icon={<Canvas.Action.Icon icon={isEmpty && !isActive ? 'warning' : SETV2_NODE_CONFIG.icon!} />}
          port={<Step.ActionPort portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />}
          label={<Canvas.Action.Label secondary={isEmpty}>{getLabel()}</Canvas.Action.Label>}
          nodeID={data.nodeID}
          active={isOpened || isActive}
          onClick={swallowEvent(onToggle)}
          reversed={reversed}
        />
      )}
    </Popper>
  );
};
