import { ResponseType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { SecondaryNavigation } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { CMSRoute, Path } from '@/config/routes';
import { Creator, Designer, Project, Router } from '@/ducks';
import { useFeature } from '@/hooks/feature';
import { useHotkey } from '@/hooks/hotkeys';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { Hotkey } from '@/keymap';
import { useCMSRoute } from '@/pages/AssistantCMS/hooks/cms-route.hook';

export const CMSLayoutMenu: React.FC = () => {
  const TEST_ID = 'cms-menu';

  const location = useLocation<{ isBackFromCanvas?: boolean }>();
  const onLinkClick = useOnLinkClick();
  const { isEnabled: isKbEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);
  const { isEnabled: isCMSFunctionsEnabled } = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);
  const { isEnabled: isResponsesEnabled } = useFeature(Realtime.FeatureFlag.CMS_RESPONSES);

  const { updateActiveCMSRoute } = useCMSRoute();

  const name = useSelector(Project.active.nameSelector);
  const hasProject = useSelector(Project.active.hasSelector);
  const flowsCount = useSelector(Designer.Flow.selectors.count);

  const intentsCount = useSelector(Designer.Intent.selectors.countWithoutNone);
  const entitiesCount = useSelector(Designer.Entity.selectors.count);
  const messagesCount = useSelector(Designer.Response.selectors.countByType(ResponseType.MESSAGE));
  const functionsCount = useSelector(Designer.Function.selectors.count);
  const variablesCount = useSelector(Designer.Variable.selectors.count);
  const workflowsCount = useSelector(Designer.Workflow.selectors.count);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);
  const knowledgeBaseCount = useSelector(Designer.KnowledgeBase.Document.selectors.count);

  const goToDiagram = useDispatch(Router.goToDiagram);

  const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

  const onTabClick = (tab: string, route: CMSRoute) => (event: React.MouseEvent<HTMLDivElement>) => {
    updateActiveCMSRoute(route);
    onLinkClick(tab, {
      state: { showKnowledgeBaseHotkeyTip: route === CMSRoute.KNOWLEDGE_BASE && location.state?.isBackFromCanvas },
    })(event);
  };

  useHotkey(Hotkey.BACK_TO_DESIGNER, () => activeDiagramID && goToDiagram(activeDiagramID), {
    disable: !activeDiagramID,
  });

  return (
    <SecondaryNavigation
      title={hasProject ? name ?? '' : 'Loading...'}
      testID={TEST_ID}
      onBackToDesignerClick={activeDiagramID ? () => goToDiagram(activeDiagramID) : undefined}
      returnToDesignerTooltip={{ text: 'Return', hotkeys: [{ iconName: 'Command' }, { label: ']' }] }}
    >
      <SecondaryNavigation.Section title="Agent" isCollapsible={false}>
        <SecondaryNavigation.Item
          icon="Workflows"
          label="Workflows"
          testID={tid(TEST_ID, 'workflows')}
          caption={String(workflowsCount)}
          onClick={onTabClick(Path.CMS_WORKFLOW, CMSRoute.WORKFLOW)}
          isActive={isItemActive(Path.CMS_WORKFLOW)}
        />

        {isKbEnabled && (
          <SecondaryNavigation.Item
            icon="Brain"
            label="Knowledge"
            testID={tid(TEST_ID, 'knowledge-base')}
            caption={String(knowledgeBaseCount)}
            onClick={onTabClick(Path.CMS_KNOWLEDGE_BASE, CMSRoute.KNOWLEDGE_BASE)}
            isActive={isItemActive(Path.CMS_KNOWLEDGE_BASE)}
          />
        )}
      </SecondaryNavigation.Section>

      <SecondaryNavigation.Section title="Content">
        {isResponsesEnabled && (
          <SecondaryNavigation.Item
            icon="Message"
            label="Messages"
            testID={tid(TEST_ID, 'messages')}
            caption={String(messagesCount)}
            onClick={onTabClick(Path.CMS_MESSAGE, CMSRoute.MESSAGE)}
            isActive={isItemActive(Path.CMS_MESSAGE)}
          />
        )}

        <SecondaryNavigation.Item
          icon="Component"
          label="Components"
          testID={tid(TEST_ID, 'components')}
          caption={String(flowsCount)}
          onClick={onTabClick(Path.CMS_FLOW, CMSRoute.FLOW)}
          isActive={isItemActive(Path.CMS_FLOW)}
        />

        <SecondaryNavigation.Item
          icon="Variable"
          label="Variables"
          testID={tid(TEST_ID, 'variables')}
          caption={String(variablesCount)}
          onClick={onTabClick(Path.CMS_VARIABLE, CMSRoute.VARIABLE)}
          isActive={isItemActive(Path.CMS_VARIABLE)}
        />

        {isCMSFunctionsEnabled && (
          <SecondaryNavigation.Item
            icon="Code"
            label="Functions"
            testID={tid(TEST_ID, 'functions')}
            caption={String(functionsCount)}
            onClick={onTabClick(Path.CMS_FUNCTION, CMSRoute.FUNCTION)}
            isActive={isItemActive(Path.CMS_FUNCTION)}
          />
        )}
      </SecondaryNavigation.Section>

      <SecondaryNavigation.Section title="Natural language">
        <SecondaryNavigation.Item
          icon="IntentS"
          label="Intents"
          testID={tid(TEST_ID, 'intents')}
          caption={String(intentsCount)}
          onClick={onTabClick(Path.CMS_INTENT, CMSRoute.INTENT)}
          isActive={isItemActive(Path.CMS_INTENT)}
        />

        <SecondaryNavigation.Item
          icon="Set"
          label="Entities"
          testID={tid(TEST_ID, 'entities')}
          caption={String(entitiesCount)}
          onClick={onTabClick(Path.CMS_ENTITY, CMSRoute.ENTITY)}
          isActive={isItemActive(Path.CMS_ENTITY)}
        />
      </SecondaryNavigation.Section>
    </SecondaryNavigation>
  );
};
