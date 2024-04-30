import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import { BlockType } from '@voiceflow/realtime-sdk';
import { Menu, Popper, Surface, Table, Text, Tooltip } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { nonEmptyTriggersMapByDiagramIDAtom } from '@/atoms/workflow.atom';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import type { ICMSWorkflowTableTriggersCell } from './CMSWorkflowTableTriggersCell.interface';

export const CMSWorkflowTableTriggersCell: React.FC<ICMSWorkflowTableTriggersCell> = ({ diagramID }) => {
  const triggers = useAtomValue(nonEmptyTriggersMapByDiagramIDAtom)[diagramID] ?? [];

  const goToDiagram = useDispatch(Router.goToDiagram, diagramID);

  const firstTrigger = triggers[0];
  const isOnlyOneTrigger = triggers.length === 1;

  return !triggers.length ? (
    <Table.Cell.Empty />
  ) : (
    <Popper
      placement="bottom-start"
      referenceElement={(popperProps) => (
        <Tooltip.Overflow
          referenceElement={(tooltipProps) => (
            <Table.Cell.Link
              ref={composeRef(tooltipProps.ref, popperProps.ref)}
              label={triggers[0].label}
              updates={triggers.length === 1 ? 0 : triggers.length}
              onClick={isOnlyOneTrigger ? () => goToDiagram(firstTrigger.nodeID) : Utils.functional.chain(popperProps.onToggle, tooltipProps.onClose)}
              iconName={firstTrigger.type === BlockType.START ? 'Start' : 'IntentS'}
              overflow
              onMouseEnter={tooltipProps.onOpen}
              onMouseLeave={tooltipProps.onClose}
            />
          )}
        >
          {() => (
            <Text variant="caption" breakWord>
              {triggers[0].label}
            </Text>
          )}
        </Tooltip.Overflow>
      )}
    >
      {() => (
        <Surface>
          <Menu onClick={(event) => event.stopPropagation()}>
            {triggers.map(({ label, nodeID }, index) => (
              <Menu.Item key={index} label={label} onClick={() => goToDiagram(nodeID)} />
            ))}
          </Menu>
        </Surface>
      )}
    </Popper>
  );
};
