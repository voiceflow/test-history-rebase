import { atom } from 'jotai';

import { nonEmptyTriggersMapByDiagramIDAtom } from '@/atoms/workflow.atom';

import type { CMSWorkflowSortContext } from './CMSWorkflow.interface';

export const cmsWorkflowSortContextAtom = atom(
  (get): CMSWorkflowSortContext => ({
    triggersMapByDiagramID: get(nonEmptyTriggersMapByDiagramIDAtom),
  })
);
