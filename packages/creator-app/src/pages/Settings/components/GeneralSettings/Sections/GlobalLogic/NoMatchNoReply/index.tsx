import { Button } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import * as S from './styles';

interface GeneralSettingsNoMatchNoReplySectionProps {
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsNoMatchNoReplySection: React.FC<GeneralSettingsNoMatchNoReplySectionProps> = ({ platformMeta }) => {
  const { descriptors } = platformMeta;

  return (
    <>
      <Section
        variant={SectionVariant.PRIMARY}
        contentSuffix={descriptors.defaultVoice}
        customContentStyling={{
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <S.Container>
          <div>
            <S.SubSectionTitle>Global No Match</S.SubSectionTitle>
            <S.SubSectionDescription>The fallback response that will trigger if the user fails to match any intent.</S.SubSectionDescription>
          </div>
          <Button variant={Button.Variant.SECONDARY} squareRadius>
            Edit
          </Button>
        </S.Container>
      </Section>
      <Section
        variant={SectionVariant.PRIMARY}
        contentSuffix={descriptors.defaultVoice}
        customContentStyling={{
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <S.Container>
          <div>
            <S.SubSectionTitle>Global No Reply</S.SubSectionTitle>
            <S.SubSectionDescription>The fallback response that will trigger if the user says nothing for 12 seconds.</S.SubSectionDescription>
          </div>
          <Button variant={Button.Variant.SECONDARY} squareRadius>
            Edit
          </Button>
        </S.Container>
      </Section>
    </>
  );
};

export default GeneralSettingsNoMatchNoReplySection;
