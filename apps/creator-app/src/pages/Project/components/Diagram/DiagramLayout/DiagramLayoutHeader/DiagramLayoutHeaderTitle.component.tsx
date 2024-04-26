import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { WorkflowMenu } from '@/components/Workflow/WorkflowMenu/WorkflowMenu.component';
import { Creator, Designer, Project, Router } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

export const DiagramLayoutHeaderTitle: React.FC = () => {
  const name = useSelector(Project.active.nameSelector);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);
  const activeWorkflow = useSelector(Designer.Workflow.selectors.oneByDiagramID, { diagramID: activeDiagramID });

  const updateName = useDispatch(Project.updateActiveProjectName);
  const goToDiagram = useDispatch(Router.goToDiagram);

  return (
    <Header.AgentNavigation.Title
      agentName={name ?? ''}
      onAgentNameChange={updateName}
      workflowName={activeWorkflow?.name ?? ''}
    >
      {({ onClose }) => (
        <WorkflowMenu width="fit-content" onClose={onClose} onSelect={(workflow) => goToDiagram(workflow.diagramID)} />
      )}
    </Header.AgentNavigation.Title>
  );
};
