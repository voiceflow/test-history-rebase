import { BaseModels } from '@voiceflow/base-types';
import { Header } from '@voiceflow/ui-next';
import React from 'react';
import { useParams } from 'react-router-dom';

import { FlowMenu } from '@/components/Flow/FlowMenu/FlowMenu.component';
import { WorkflowMenu } from '@/components/Workflow/WorkflowMenu/WorkflowMenu.component';
import { Designer, Diagram, Project, Router, Session } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

export const DiagramLayoutHeaderTitle: React.FC = () => {
  const params = useParams<{ diagramID?: string }>();

  const name = useSelector(Project.active.nameSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const diagramID = params.diagramID ?? activeDiagramID;
  const diagram = useSelector(Diagram.diagramByIDSelector, { id: diagramID });
  const isTopic = diagram?.type === BaseModels.Diagram.DiagramType.TOPIC;

  const activeResource = useSelector(
    isTopic ? Designer.Workflow.selectors.oneByDiagramID : Designer.Flow.selectors.oneByDiagramID,
    { diagramID }
  );

  const updateName = useDispatch(Project.updateActiveProjectName);
  const goToDiagram = useDispatch(Router.goToDiagramHistoryClear);

  return (
    <Header.AgentNavigation.Title
      agentName={name ?? ''}
      onAgentNameChange={updateName}
      workflowName={activeResource?.name ?? ''}
    >
      {({ onClose }) =>
        isTopic ? (
          <WorkflowMenu maxWidth={258} onClose={onClose} onSelect={(workflow) => goToDiagram(workflow.diagramID)} />
        ) : (
          <FlowMenu maxWidth={258} onClose={onClose} onSelect={(flow) => goToDiagram(flow.diagramID)} />
        )
      }
    </Header.AgentNavigation.Title>
  );
};
