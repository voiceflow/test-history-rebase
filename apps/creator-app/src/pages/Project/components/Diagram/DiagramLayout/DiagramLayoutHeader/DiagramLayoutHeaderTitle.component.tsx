import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { FlowMenu } from '@/components/Flow/FlowMenu/FlowMenu.component';
import { WorkflowMenu } from '@/components/Workflow/WorkflowMenu/WorkflowMenu.component';
import { Creator, Designer, Diagram, Project, Router } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

export const DiagramLayoutHeaderTitle: React.FC = () => {
  const name = useSelector(Project.active.nameSelector);
  const isTopic = useSelector(Diagram.active.isTopicSelector);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);

  const activeResource = useSelector(isTopic ? Designer.Workflow.selectors.oneByDiagramID : Designer.Flow.selectors.oneByDiagramID, {
    diagramID: activeDiagramID,
  });

  const updateName = useDispatch(Project.updateActiveProjectName);
  const goToDiagram = useDispatch(Router.goToDiagram);

  return (
    <Header.AgentNavigation.Title agentName={name ?? ''} onAgentNameChange={updateName} workflowName={activeResource?.name ?? ''}>
      {({ onClose }) =>
        isTopic ? (
          <WorkflowMenu width="fit-content" onClose={onClose} onSelect={(workflow) => goToDiagram(workflow.diagramID)} />
        ) : (
          <FlowMenu width="fit-content" onClose={onClose} onSelect={(flow) => goToDiagram(flow.diagramID)} />
        )
      }
    </Header.AgentNavigation.Title>
  );
};
