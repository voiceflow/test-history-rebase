import { Header } from '@voiceflow/ui-next';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { CMSRoute, Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Creator, Designer, Diagram, Router, UI } from '@/ducks';
import { usePermission } from '@/hooks/permission';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import StartPrototypeButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Run';
import PublishButton from '@/pages/Project/components/Header/components/CanvasHeader/components/Upload';
import SharePrototypeButton from '@/pages/Project/components/Header/components/PrototypeHeader/components/Share';
import { SelectionTargetsContext } from '@/pages/Project/contexts';

import { headerStyle } from './DiagramLayoutHeader.css';
import { DiagramLayoutHeaderActions } from './DiagramLayoutHeaderActions.component';
import { DiagramLayoutHeaderMembers } from './DiagramLayoutHeaderMembers.component';
import { DiagramLayoutHeaderPrototypeClose } from './DiagramLayoutHeaderPrototypeClose.component';
import { DiagramLayoutHeaderPrototypeSettings } from './DiagramLayoutHeaderPrototypeSettings.component copy';
import { DiagramLayoutHeaderTitle } from './DiagramLayoutHeaderTitle.component';

export const DiagramLayoutHeader: React.FC = () => {
  const isPrototype = !!useRouteMatch(Path.PROJECT_PROTOTYPE);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const selectedTargets = React.useContext(SelectionTargetsContext);

  const isWorkflow = useSelector(Diagram.active.isTopicSelector);
  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);
  const startNodeID = useSelector(Creator.startNodeIDSelector);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);

  const getFlowByDiagramID = useGetValueSelector(Designer.Flow.selectors.oneByDiagramID);
  const getWorkflowByDiagramID = useGetValueSelector(Designer.Workflow.selectors.oneByDiagramID);

  const goToCMSResource = useDispatch(Router.goToCMSResource);

  const onBackClick = () => {
    if (!activeDiagramID) return;

    const resourceID = isWorkflow
      ? getWorkflowByDiagramID({ diagramID: activeDiagramID })?.id
      : getFlowByDiagramID({ diagramID: activeDiagramID })?.id;

    goToCMSResource(isWorkflow ? CMSRoute.WORKFLOW : CMSRoute.FLOW, resourceID);
  };

  const showActions = canEditCanvas && (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID));

  return (
    <Header className={headerStyle({ canvasOnly })}>
      <Header.Section.Left mr={214}>
        <Header.Button.IconSecondary onClick={onBackClick} iconName="ArrowLeft" />
      </Header.Section.Left>

      <Header.Section.Center>{showActions ? <DiagramLayoutHeaderActions /> : <DiagramLayoutHeaderTitle />}</Header.Section.Center>

      <Header.Section.Right>
        <DiagramLayoutHeaderMembers />

        <Header.Section.RightActions>
          {isPrototype ? (
            <>
              <DiagramLayoutHeaderPrototypeSettings />

              <SharePrototypeButton />
            </>
          ) : (
            <PublishButton />
          )}

          {isPrototype ? <DiagramLayoutHeaderPrototypeClose /> : <StartPrototypeButton />}
        </Header.Section.RightActions>
      </Header.Section.Right>
    </Header>
  );
};
