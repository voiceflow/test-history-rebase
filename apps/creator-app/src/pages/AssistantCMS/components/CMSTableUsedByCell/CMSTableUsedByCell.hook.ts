import { useAtomValue } from 'jotai';
import { useCallback } from 'react';

import { flowMapByDiagramIDAtom } from '@/atoms/flow.atom';
import { resourceMapAtom } from '@/atoms/reference.atom';
import { workflowMapByDiagramIDAtom } from '@/atoms/workflow.atom';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import type { CMSTableUsedByCellItem } from './CMSTableUsedByCell.interface';
import { CMSTableUsedByCellItemType } from './CMSTableUsedByCellItemType.enum';

export const useCMSTableUsedByCellGetItem = () => {
  const goToDiagram = useDispatch(Router.goToDiagram);

  const resourceMap = useAtomValue(resourceMapAtom);
  const flowMapByDiagramID = useAtomValue(flowMapByDiagramIDAtom);
  const workflowMapByDiagramID = useAtomValue(workflowMapByDiagramIDAtom);

  const getReferrerItem = useCallback(
    (id: string | null): null | CMSTableUsedByCellItem => {
      const resource = id ? resourceMap[id] ?? null : null;

      if (!id || !resource?.diagramID) return null;

      const flow = flowMapByDiagramID[resource.diagramID];
      const workflow = workflowMapByDiagramID[resource.diagramID];

      const flowOrWorkflow = flow ?? workflow;

      if (!flowOrWorkflow) return null;

      return {
        id,
        type: workflow ? CMSTableUsedByCellItemType.WORKFLOW : CMSTableUsedByCellItemType.FLOW,
        label: flowOrWorkflow.name,
        onClick: () => goToDiagram(flowOrWorkflow.diagramID, resource.resourceID),
      };
    },
    [resourceMap, flowMapByDiagramID, workflowMapByDiagramID]
  );

  return getReferrerItem;
};
