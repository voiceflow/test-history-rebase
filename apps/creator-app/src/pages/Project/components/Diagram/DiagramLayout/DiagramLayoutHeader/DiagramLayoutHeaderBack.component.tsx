import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
import React, { useContext } from 'react';

import { CMSRoute } from '@/config/routes';
import { PrototypeStatus } from '@/constants/prototype';
import { Creator, Designer, Diagram, Router } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useDidUpdateEffect } from '@/hooks/lifecircle.hook';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import { PrototypeContext } from '@/pages/Prototype/context';

interface IDiagramLayoutHeaderBack {
  isPrototype: boolean;
}

export const DiagramLayoutHeaderBack: React.FC<IDiagramLayoutHeaderBack> = ({ isPrototype }) => {
  const prototype = useContext(PrototypeContext);
  const [trackingEvents] = useTrackingEvents();
  const tooltipModifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);

  const isWorkflow = useSelector(Diagram.active.isTopicSelector);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);
  const { diagramID, nodeID } = useSelector(Creator.previousDiagramHistoryStateSelector) ?? {};

  const getFlowByDiagramID = useGetValueSelector(Designer.Flow.selectors.oneByDiagramID);
  const getWorkflowByDiagramID = useGetValueSelector(Designer.Workflow.selectors.oneByDiagramID);

  const goToCMSResource = useDispatch(Router.goToCMSResource);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const goToComponentInstance = useDispatch(Router.goToDiagramHistoryPop);

  const isReturnToInstance = !isWorkflow && diagramID && nodeID;

  const onBackClick = () => {
    if (isPrototype) {
      goToCurrentCanvas();
      return;
    }

    if (isReturnToInstance) {
      goToComponentInstance();
      return;
    }

    if (!activeDiagramID) return;

    const resourceID = isWorkflow
      ? getWorkflowByDiagramID({ diagramID: activeDiagramID })?.id
      : getFlowByDiagramID({ diagramID: activeDiagramID })?.id;

    goToCMSResource(isWorkflow ? CMSRoute.WORKFLOW : CMSRoute.FLOW, resourceID, { isBackFromCanvas: true });
  };

  useHotkey(Hotkey.BACK_TO_CMS, onBackClick, { preventDefault: true });

  useDidUpdateEffect(() => {
    if (prototype.state.status === PrototypeStatus.ACTIVE) {
      trackingEvents.trackProjectPrototypeEnd();
    }
  }, [prototype.state.status]);

  const geLabel = () => {
    if (isPrototype) return 'Back';
    if (isReturnToInstance) return 'Return to instance';
    return undefined;
  };

  return (
    <TooltipWithKeys
      text="Back"
      hotkeys={[{ label: getHotkeyLabel(Hotkey.BACK_TO_CMS) }]}
      modifiers={tooltipModifiers}
      placement="bottom"
      referenceElement={({ ref, onOpen, onClose }) => (
        <Header.Button.Navigation
          ref={ref}
          label={geLabel()}
          onClick={onBackClick}
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    />
  );
};
