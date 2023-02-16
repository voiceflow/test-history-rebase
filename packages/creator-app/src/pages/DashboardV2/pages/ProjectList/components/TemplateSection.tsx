import { AssistantCard, Box, Button } from '@voiceflow/ui';
import React from 'react';

import { chatTemplate, teamsTemplate, whatsappTemplate } from '@/assets';

import * as S from '../styles';

const TemplateSection: React.FC = () => (
  <Box fullWidth>
    <S.Title>Start with a template</S.Title>

    <S.Grid>
      <AssistantCard
        image={<AssistantCard.Image src={chatTemplate} backgroundColor="#f4f8fe" />}
        action={<Button>Copy Template</Button>}
        title="Webchat - Book a Demo"
        subtitle="By Voiceflow"
        icon="slack"
      />
      <AssistantCard
        image={<AssistantCard.Image src={whatsappTemplate} backgroundColor="#f5faf6" />}
        action={<Button>Copy Template</Button>}
        title="Whatsapp Customer Support"
        subtitle="By Voiceflow"
        icon="logoWhatsapp"
      />
      <AssistantCard
        image={<AssistantCard.Image src={teamsTemplate} backgroundColor="#f4f4fb" />}
        action={<Button>Copy Template</Button>}
        title="Microsoft Teams Internal Assistant"
        subtitle="By Voiceflow"
        icon="logoMicrosoftTeams"
      />
      <AssistantCard
        image={<AssistantCard.Image src={chatTemplate} backgroundColor="#f4f8fe" />}
        action={<Button>Copy Template</Button>}
        title="Webchat - Book a Demo"
        subtitle="By Voiceflow"
        icon="slack"
      />
    </S.Grid>
  </Box>
);

export default TemplateSection;
