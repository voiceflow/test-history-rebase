import { SecondaryNavigation } from '@voiceflow/ui-next';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import { Path } from '@/config/routes';
import { Designer } from '@/ducks';
import * as ProjectV2 from '@/ducks/projectV2';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useSelector } from '@/hooks/store.hook';

export const CMSMenu: React.FC = () => {
  const location = useLocation();
  const onLinkClick = useOnLinkClick();

  const name = useSelector(ProjectV2.active.nameSelector);
  // const flowsCount = useSelector(Designer.Flow.selectors.count);
  // const storiesCount = useSelector(Designer.Story.selectors.count);
  // const promptsCount = useSelector(Designer.Prompt.selectors.count);
  const intentsCount = useSelector(Designer.Intent.selectors.count);
  const entitiesCount = useSelector(Designer.Entity.selectors.count);
  const dataSourcesCount = 0;
  // const functionsCount = useSelector(Designer.Function.selectors.count);
  // const responsesCount = useSelector(Designer.Response.selectors.count);
  // const variablesCount = useSelector(Designer.Variable.selectors.count);

  const isItemActive = (path: string) => !!matchPath(location.pathname, { path, exact: false });

  return (
    <SecondaryNavigation title={name ?? ''}>
      <SecondaryNavigation.Section title="Agent" isCollapsible={false}>
        <SecondaryNavigation.Item
          icon="Brain"
          label="Knowledge"
          caption={String(dataSourcesCount)}
          onClick={onLinkClick(Path.CMS_KNOWLEDGE_BASE)}
          isActive={isItemActive(Path.CMS_KNOWLEDGE_BASE)}
        />
      </SecondaryNavigation.Section>
      {/* <SecondaryNavigation.Section title="Agent" isCollapsible={false}>
      <SecondaryNavigation.Item
          icon="Home"
          label="Storyboard"
          caption={String(storiesCount)}
          onClick={onLinkClick(AssistantCMSRoute.STORIES)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_STORIES.pathname)}
        />
      </SecondaryNavigation.Section>

      <SecondaryNavigation.Section title="Content">
        <SecondaryNavigation.Item
          icon="Message"
          label="Responses"
          caption={String(responsesCount)}
          onClick={onLinkClick(AssistantCMSRoute.RESPONSES)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_RESPONSES.pathname)}
        />

        <SecondaryNavigation.Item
          icon="Generate"
          label="Prompts"
          caption={String(promptsCount)}
          onClick={onLinkClick(AssistantCMSRoute.PROMPTS)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_PROMPTS.pathname)}
        />

        <SecondaryNavigation.Item
          icon="Choice"
          label="Flows"
          onClick={onLinkClick(AssistantCMSRoute.FLOWS)}
          caption={String(flowsCount)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_FLOWS.pathname)}
        />

        <SecondaryNavigation.Item
          icon="Variable"
          label="Variables"
          caption={String(variablesCount)}
          onClick={onLinkClick(AssistantCMSRoute.VARIABLES)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_VARIABLES.pathname)}
        />

        <SecondaryNavigation.Item
          icon="Code"
          label="Functions"
          caption={String(functionsCount)}
          onClick={onLinkClick(AssistantCMSRoute.FUNCTIONS)}
          isActive={isItemActive(AbsolutePath.ASSISTANT_CMS_FUNCTIONS.pathname)}
        />
       */}

      <SecondaryNavigation.Section title="Natural language">
        <SecondaryNavigation.Item
          icon="IntentS"
          label="Intents"
          caption={String(intentsCount)}
          onClick={onLinkClick(Path.CMS_INTENT)}
          isActive={isItemActive(Path.CMS_INTENT)}
        />

        <SecondaryNavigation.Item
          icon="Set"
          label="Entities"
          caption={String(entitiesCount)}
          onClick={onLinkClick(Path.CMS_ENTITY)}
          isActive={isItemActive(Path.CMS_ENTITY)}
        />
      </SecondaryNavigation.Section>
    </SecondaryNavigation>
  );
};
