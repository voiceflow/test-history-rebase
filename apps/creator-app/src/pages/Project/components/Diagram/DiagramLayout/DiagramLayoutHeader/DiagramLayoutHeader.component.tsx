import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { CMSRoute, Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import { Creator, Designer, Diagram, Router, UI } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { usePermission } from '@/hooks/permission';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import { getHotkeyLabel, Hotkey } from '@/keymap';
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

interface IDiagramLayoutHeader {
  isLoader?: boolean;
}

export const DiagramLayoutHeader: React.FC<IDiagramLayoutHeader> = ({ isLoader }) => {
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

  const tooltipModifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  useHotkey(Hotkey.BACK_TO_CMS, onBackClick, { preventDefault: true });

  return (
    <Header className={headerStyle({ canvasOnly })}>
      <Header.Section.Left mr={214}>
        <TooltipWithKeys
          text="Exit"
          hotkeys={[{ label: getHotkeyLabel(Hotkey.BACK_TO_CMS) }]}
          variant="basic"
          modifiers={tooltipModifiers}
          placement="bottom"
          referenceElement={({ ref, onOpen, onClose }) => (
            <Header.Button.Navigation ref={ref} onClick={onBackClick} onMouseEnter={onOpen} onMouseLeave={onClose} />
          )}
        />
      </Header.Section.Left>

      <Header.Section.Center>{!isLoader && <>{showActions ? <DiagramLayoutHeaderActions /> : <DiagramLayoutHeaderTitle />}</>}</Header.Section.Center>

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
