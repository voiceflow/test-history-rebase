import { Menu } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import { memoize } from 'lodash';
import { getOne } from 'normal-store';
import React, { useCallback, useMemo } from 'react';

import { flowMapByDiagramIDAtom } from '@/atoms/flow.atom';
import {
  diagramIDResourceIDMapAtom,
  normalizedResourcesAtom,
  refererIDsByResourceIDMapAtom,
} from '@/atoms/reference.atom';
import { workflowMapByDiagramIDAtom } from '@/atoms/workflow.atom';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { CMSTableLinkMenuCell } from '@/pages/AssistantCMS/components/CMSTableLinkMenuCell/CMSTableLinkMenuCell.component';

interface ICMSFlowTableUsedByCell {
  diagramID: string;
}

export const CMSFlowTableUsedByCell: React.FC<ICMSFlowTableUsedByCell> = ({ diagramID }) => {
  const goToDiagram = useDispatch(Router.goToDiagram);

  const flowMapByDiagramID = useAtomValue(flowMapByDiagramIDAtom);
  const normalizedResources = useAtomValue(normalizedResourcesAtom);
  const diagramIDResourceIDMap = useAtomValue(diagramIDResourceIDMapAtom);
  const workflowMapByDiagramID = useAtomValue(workflowMapByDiagramIDAtom);
  const refererIDsByResourceIDMap = useAtomValue(refererIDsByResourceIDMapAtom);

  const resourceID = diagramIDResourceIDMap[diagramID];
  const refererIDs = resourceID ? refererIDsByResourceIDMap[resourceID] ?? [] : [];
  const firstRefererID = refererIDs[0];

  const getReferrerItem = useCallback(
    (id: string | null) => {
      const resource = id ? getOne(normalizedResources, id) : null;

      if (!id || !resource?.diagramID) return null;

      const flow = flowMapByDiagramID[resource.diagramID];
      const workflow = workflowMapByDiagramID[resource.diagramID];

      const flowOrWorkflow = flow ?? workflow;

      if (!flowOrWorkflow) return null;

      return {
        id,
        type: workflow ? 'workflow' : 'flow',
        label: flowOrWorkflow.name,
        onClick: () => goToDiagram(flowOrWorkflow.diagramID, resource.resourceID),
        diagramID: flowOrWorkflow.diagramID,
      };
    },
    [normalizedResources, flowMapByDiagramID, workflowMapByDiagramID]
  );

  const getContentMemoized = useMemo(
    () =>
      memoize((items: string[], getRefItem: typeof getReferrerItem) => {
        const itemMap: Record<string, NonNullable<ReturnType<typeof getReferrerItem>>> = {};
        const flowIDs: string[] = [];
        const workflowIDs: string[] = [];

        for (const id of items) {
          const item = getRefItem(id);

          if (!item) continue;

          if (item.type === 'workflow') {
            workflowIDs.push(item.id);
          } else {
            flowIDs.push(item.id);
          }

          itemMap[item.id] = item;
        }

        const result: React.ReactNode[] = [];

        if (workflowIDs.length) {
          result.push(<Menu.Divider key="workflow-divider" label="Workflows" fullWidth={false} />);

          result.push(
            ...workflowIDs.map((id) => {
              const item = itemMap[id];

              return <Menu.Item key={id} label={item.label} onClick={item.onClick} />;
            })
          );
        }

        if (flowIDs.length) {
          result.push(<Menu.Divider key="flow-divider" label="Components" fullWidth={false} />);

          result.push(
            ...flowIDs.map((id) => {
              const item = itemMap[id];

              return <Menu.Item key={id} label={item.label} onClick={item.onClick} />;
            })
          );
        }

        return result;
      }),
    []
  );

  const getContent = ({ items }: { items: string[] }) => getContentMemoized(items, getReferrerItem);

  const firstItem = getReferrerItem(firstRefererID);

  return (
    <CMSTableLinkMenuCell
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      label={`${firstItem?.label ?? ''}${refererIDs.length > 1 ? ` (${refererIDs.length})` : ''}`}
      items={refererIDs}
      onClick={firstItem?.onClick ?? (() => null)}
    >
      {getContent}
    </CMSTableLinkMenuCell>
  );
};
