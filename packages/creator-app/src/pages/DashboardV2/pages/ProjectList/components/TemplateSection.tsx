import * as Platform from '@voiceflow/platform-config';
import { AssistantCard, Box, Button } from '@voiceflow/ui';
import React from 'react';

import { vfLogo } from '@/assets';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { useGetAIAssistSettings } from '@/ModalsV2/modals/Disclaimer/hooks/aiPlayground';

import * as S from '../styles';

const PAYMENT_ACCOUNT_TEMPLATE_TAG = 'paymentsAccount';
const RETAIL_PURCHASES_TEMPLATE_TAG = 'retailPurchases';
const SUPPORT_CHATBOT_TEMPLATE_TAG = 'supportChatbot';
const TRAVEL_ASSISTANT_TEMPLATE_TAG = 'travelAssistant';

const TemplateSection: React.FC = () => {
  const getAIAssistSettings = useGetAIAssistSettings();
  const goToDomain = useDispatch(Router.goToDomain);
  const createProject = useDispatch(Project.createProject);

  const createAndGo = async (tag: string, platform: Platform.Constants.PlatformType) => {
    const aiAssistSettings = await getAIAssistSettings();
    if (!aiAssistSettings) return;

    const { versionID } = await createProject({
      nluType: Platform.Constants.NLUType.VOICEFLOW,
      platform,
      templateTag: `dashboard:${tag}`,
      projectType: Platform.Constants.ProjectType.CHAT,
      aiAssistSettings,
      tracking: {
        language: 'English (en-US)',
        onboarding: true,
      },
    });

    goToDomain({ versionID });
  };

  return (
    <Box fullWidth>
      <S.Title>Start with a template</S.Title>

      <S.Grid>
        <AssistantCard
          image={<AssistantCard.ProjectImage src={vfLogo} />}
          action={<Button onClick={() => createAndGo(PAYMENT_ACCOUNT_TEMPLATE_TAG, Platform.Constants.PlatformType.VOICEFLOW)}>Copy Template</Button>}
          title="Payments & Accounts (IVR)"
          subtitle="By Voiceflow"
          icon="voiceflowV"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={vfLogo} />}
          action={
            <Button onClick={() => createAndGo(RETAIL_PURCHASES_TEMPLATE_TAG, Platform.Constants.PlatformType.VOICEFLOW)}>Copy Template</Button>
          }
          title="Retail Purchases (Chat)"
          subtitle="By Voiceflow"
          icon="chatWidget"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={vfLogo} />}
          action={<Button onClick={() => createAndGo(SUPPORT_CHATBOT_TEMPLATE_TAG, Platform.Constants.PlatformType.WEBCHAT)}>Copy Template</Button>}
          title="Support Chatbot (Webchat)"
          subtitle="By Voiceflow"
          icon="chatWidget"
        />
        <AssistantCard
          image={<AssistantCard.ProjectImage src={vfLogo} />}
          action={<Button onClick={() => createAndGo(TRAVEL_ASSISTANT_TEMPLATE_TAG, Platform.Constants.PlatformType.WHATSAPP)}>Copy Template</Button>}
          title="Travel Assistant (ChatGPT)"
          subtitle="By Voiceflow"
          icon="logoWhatsapp"
        />
      </S.Grid>
    </Box>
  );
};

export default TemplateSection;
