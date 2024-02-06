import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { SecondaryNavigation } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { CMSRoute, Path } from '@/config/routes';
import { Designer } from '@/ducks';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature } from '@/hooks';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';
import { useCMSRoute } from '@/pages/AssistantCMS/hooks/cms-route.hook';

export const CMSMenu: React.FC = () => {
  const TEST_ID = 'cms-menu';

  const location = useLocation();
  const onLinkClick = useOnLinkClick();
  const { isEnabled: isKbEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE);
  const { isEnabled: isFunctionsCmsEnabled } = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);
  const { isEnabled: isCMSVariablesEnabled } = useFeature(Realtime.FeatureFlag.CMS_VARIABLES);

  const { updateActiveCMSRoute } = useCMSRoute();

  const name = useSelector(ProjectV2.active.nameSelector);
  // const flowsCount = useSelector(Designer.Flow.selectors.count);
  // const storiesCount = useSelector(Designer.Story.selectors.count);
  // const promptsCount = useSelector(Designer.Prompt.selectors.count);
  const intentsCount = useSelector(Designer.Intent.selectors.countWithoutFallback);
  const entitiesCount = useSelector(Designer.Entity.selectors.count);
  const functionsCount = useSelector(Designer.Function.selectors.count);
  const variablesCount = useSelector(Designer.Variable.selectors.count);
  const knowledgeBaseCount = useSelector(Designer.KnowledgeBase.Document.selectors.count);
  // const responsesCount = useSelector(Designer.Response.selectors.count);

  const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

  const onTabClick = (tab: string, route: CMSRoute) => (event: React.MouseEvent<HTMLDivElement>) => {
    updateActiveCMSRoute(route);
    onLinkClick(tab)(event);
  };

  return (
    <SecondaryNavigation title={name ?? ''} testID={TEST_ID}>
      {isKbEnabled && (
        <SecondaryNavigation.Section title="Agent" isCollapsible={false}>
          <SecondaryNavigation.Item
            icon="Brain"
            label="Knowledge"
            caption={String(knowledgeBaseCount)}
            onClick={onTabClick(Path.CMS_KNOWLEDGE_BASE, CMSRoute.KNOWLEDGE_BASE)}
            isActive={isItemActive(Path.CMS_KNOWLEDGE_BASE)}
            testID={tid(TEST_ID, 'knowledge-base')}
          />
        </SecondaryNavigation.Section>
      )}

      {/* <SecondaryNavigation.Section title="Agent" isCollapsible={false}>
      <SecondaryNavigation.Item
          icon="Home"
          label="Storyboard"
          caption={String(storiesCount)}
          onClick={onTabClick(AssistantCMSRoute.STORIES)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_STORIES.pathname)}
          testID={tid(TEST_ID, 'storyboard')}
        />
      </SecondaryNavigation.Section>

      <SecondaryNavigation.Section title="Content">
        <SecondaryNavigation.Item
          icon="Message"
          label="Responses"
          caption={String(responsesCount)}
          onClick={onTabClick(AssistantCMSRoute.RESPONSES)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_RESPONSES.pathname)}
          testID={tid(TEST_ID, 'responses')}
        />

        <SecondaryNavigation.Item
          icon="Generate"
          label="Prompts"
          caption={String(promptsCount)}
          onClick={onTabClick(AssistantCMSRoute.PROMPTS)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_PROMPTS.pathname)}
          testID={tid(TEST_ID, 'prompts')}
        />

        <SecondaryNavigation.Item
          icon="Choice"
          label="Flows"
          onClick={onTabClick(AssistantCMSRoute.FLOWS)}
          caption={String(flowsCount)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_FLOWS.pathname)}
          testID={tid(TEST_ID, 'flows')}
        />

      */}

      {(isFunctionsCmsEnabled || isCMSVariablesEnabled) && (
        <SecondaryNavigation.Section title="Content">
          <SecondaryNavigation.Item
            icon="Component"
            label="Components"
            caption={String(variablesCount)}
            onClick={onTabClick(Path.CMS_COMPONENT, CMSRoute.COMPONENT)}
            isActive={isItemActive(Path.CMS_COMPONENT)}
            testID="cms-menu__item--variables"
          />

          {isCMSVariablesEnabled && (
            <SecondaryNavigation.Item
              icon="Variable"
              label="Variables"
              caption={String(variablesCount)}
              onClick={onTabClick(Path.CMS_VARIABLE, CMSRoute.VARIABLE)}
              isActive={isItemActive(Path.CMS_VARIABLE)}
              testID={tid(TEST_ID, 'variables')}
            />
          )}

          {isFunctionsCmsEnabled && (
            <SecondaryNavigation.Item
              icon="Code"
              label="Functions"
              caption={String(functionsCount)}
              onClick={onTabClick(Path.CMS_FUNCTION, CMSRoute.FUNCTION)}
              isActive={isItemActive(Path.CMS_FUNCTION)}
              testID={tid(TEST_ID, 'functions')}
            />
          )}
        </SecondaryNavigation.Section>
      )}

      <SecondaryNavigation.Section title="Natural language">
        <SecondaryNavigation.Item
          icon="IntentS"
          label="Intents"
          caption={String(intentsCount)}
          onClick={onTabClick(Path.CMS_INTENT, CMSRoute.INTENT)}
          isActive={isItemActive(Path.CMS_INTENT)}
          testID={tid(TEST_ID, 'intents')}
        />

        <SecondaryNavigation.Item
          icon="Set"
          label="Entities"
          caption={String(entitiesCount)}
          onClick={onTabClick(Path.CMS_ENTITY, CMSRoute.ENTITY)}
          isActive={isItemActive(Path.CMS_ENTITY)}
          testID={tid(TEST_ID, 'entities')}
        />
      </SecondaryNavigation.Section>
    </SecondaryNavigation>
  );
};
