import { AssistantCard, Box, Button } from '@voiceflow/ui';
import React from 'react';

import { LimitType } from '@/constants/limits';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePlanLimitedConfig, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { useGetAIAssistSettings } from '@/ModalsV2/modals/Disclaimer/hooks/aiPlayground';

import * as S from '../styles';
import {
  PAYMENT_ACCOUNT_IMAGE,
  PAYMENT_ACCOUNT_TEMPLATE_TAG,
  RETAIL_PURCHASES_IMAGE,
  RETAIL_PURCHASES_TEMPLATE_TAG,
  SUPPORT_CHATBOT_IMAGE,
  SUPPORT_CHATBOT_TEMPLATE_TAG,
  TRAVEL_ASSISTANT_IMAGE,
  TRAVEL_ASSISTANT_TEMPLATE_TAG,
} from './constants';

const TemplateSection: React.FC = () => {
  const getAIAssistSettings = useGetAIAssistSettings();
  const goToCanvas = useDispatch(Router.goToCanvas);
  const createProject = useDispatch(Project.createProject);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);

  const projectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, { value: projectsCount, limit: projectsLimit });

  const onCreateProject = async (tag: string) => {
    if (projectsLimitConfig) {
      upgradeModal.openVoid(projectsLimitConfig.upgradeModal(projectsLimitConfig.payload));
    } else {
      const aiAssistSettings = await getAIAssistSettings();
      if (!aiAssistSettings) return;

      const { versionID } = await createProject({ templateTag: `dashboard:${tag}`, aiAssistSettings });

      goToCanvas({ versionID });
    }
  };

  return (
    <Box fullWidth>
      <S.Title>Start with a template</S.Title>

      <S.Grid>
        <AssistantCard
          image={<AssistantCard.ProjectImage src={PAYMENT_ACCOUNT_IMAGE} />}
          action={<Button onClick={() => onCreateProject(PAYMENT_ACCOUNT_TEMPLATE_TAG)}>Copy Template</Button>}
          title="Payments & Accounts (IVR)"
          subtitle="By Voiceflow"
          icon="voiceflowV"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={RETAIL_PURCHASES_IMAGE} />}
          action={<Button onClick={() => onCreateProject(RETAIL_PURCHASES_TEMPLATE_TAG)}>Copy Template</Button>}
          title="Retail Purchases (Chat)"
          subtitle="By Voiceflow"
          icon="chatWidget"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={SUPPORT_CHATBOT_IMAGE} />}
          action={<Button onClick={() => onCreateProject(SUPPORT_CHATBOT_TEMPLATE_TAG)}>Copy Template</Button>}
          title="Support Chatbot (Webchat)"
          subtitle="By Voiceflow"
          icon="chatWidget"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={TRAVEL_ASSISTANT_IMAGE} />}
          action={<Button onClick={() => onCreateProject(TRAVEL_ASSISTANT_TEMPLATE_TAG)}>Copy Template</Button>}
          title="Travel Assistant (ChatGPT)"
          subtitle="By Voiceflow"
          icon="logoWhatsapp"
        />
      </S.Grid>
    </Box>
  );
};

export default TemplateSection;
