import * as Platform from '@voiceflow/platform-config';
import { AssistantCard, Box, Button } from '@voiceflow/ui';
import React from 'react';

import { LimitType } from '@/constants/limits';
import * as Organization from '@/ducks/organization';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePlanLimitedConfig, useSelector } from '@/hooks';
import { useConditionalLimit } from '@/hooks/planLimitV3';
import * as ModalsV2 from '@/ModalsV2';

import * as S from '../styles';

const TemplateSection: React.FC = () => {
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const projectsCount = useSelector(ProjectV2.projectsCountSelector);
  const projectsLimit = useSelector(WorkspaceV2.active.projectsLimitSelector);
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const createProject = useDispatch(ProjectV2.createProject);
  const goToProjectCanvas = useDispatch(Router.goToProjectCanvas);

  // FIXME: remove FF https://voiceflow.atlassian.net/browse/CV3-994
  const legacyProjectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, {
    value: projectsCount,
    limit: projectsLimit,
  });
  const newProjectsLimitConfig = useConditionalLimit(LimitType.PROJECTS, { value: projectsCount });

  const projectsLimitConfig = subscription ? newProjectsLimitConfig : legacyProjectsLimitConfig;

  const onCreateProject = async ({
    type,
    platform,
    templateTag,
  }: {
    type: Platform.Constants.ProjectType;
    platform: Platform.Constants.PlatformType;
    templateTag: string;
  }) => {
    if (projectsLimitConfig) {
      upgradeModal.openVoid(projectsLimitConfig.upgradeModal(projectsLimitConfig.payload));
    } else {
      const platformConfig = Platform.Config.get(platform);

      const { versionID } = await createProject({
        nlu: null,
        project: {
          name: null,
          image: null,
          listID: null,
          members: [],
          locales: platformConfig.types[type]?.project.locale.defaultLocales ?? [],
          aiAssistSettings: { aiPlayground: true },
        },
        modality: { platform, type },
        tracking: { onboarding: false },
        templateTag,
      });

      goToProjectCanvas({ versionID });
    }
  };

  return (
    <Box fullWidth>
      <S.Title>Start with a template</S.Title>

      <S.Grid>
        <AssistantCard
          icon="chatWidget"
          title="Retail Purchases (Webchat)"
          subtitle="By Voiceflow"
          image={
            <AssistantCard.ProjectImage src="https://cm4-production-assets.s3.amazonaws.com/1677254079988-shopping-cart-gef00a8b31_1920.png" />
          }
          action={
            <Button
              onClick={() =>
                onCreateProject({
                  type: Platform.Constants.ProjectType.CHAT,
                  platform: Platform.Constants.PlatformType.VOICEFLOW,
                  templateTag: 'dashboard:retailPurchases',
                })
              }
            >
              Copy Template
            </Button>
          }
        />

        <AssistantCard
          icon="chatWidget"
          title="Support Chatbot (Webchat)"
          subtitle="By Voiceflow"
          image={<AssistantCard.ProjectImage src="https://cdn.voiceflow.com/assets/logomark.png" />}
          action={
            <Button
              onClick={() =>
                onCreateProject({
                  type: Platform.Constants.ProjectType.CHAT,
                  platform: Platform.Constants.PlatformType.WEBCHAT,
                  templateTag: 'dashboard:supportChatbot',
                })
              }
            >
              Copy Template
            </Button>
          }
        />
      </S.Grid>
    </Box>
  );
};

export default TemplateSection;
