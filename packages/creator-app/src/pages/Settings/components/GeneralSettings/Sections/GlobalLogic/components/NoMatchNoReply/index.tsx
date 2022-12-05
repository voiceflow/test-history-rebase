import * as Platform from '@voiceflow/platform-config';
import { Button } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as ModalsV2 from '@/ModalsV2';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import MessageDelayPopper from './MessageDelayPopper';
import * as S from './styles';

interface GeneralSettingsNoMatchNoReplySectionProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsNoMatchNoReplySection: React.FC<GeneralSettingsNoMatchNoReplySectionProps> = () => {
  const noMatchModal = ModalsV2.useModal(ModalsV2.Canvas.GlobalNoMatch);
  const noReplyModal = ModalsV2.useModal(ModalsV2.Canvas.GlobalNoReply);

  return (
    <>
      <Section
        variant={SectionVariant.PRIMARY}
        customContentStyling={{
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <S.Container>
          <S.TextContainer>
            <S.SubSectionTitle>Global No Match</S.SubSectionTitle>
            <S.SubSectionDescription>The fallback response that will trigger if the user fails to match any intent.</S.SubSectionDescription>
          </S.TextContainer>
          <Button variant={Button.Variant.SECONDARY} flat onClick={() => noMatchModal.openVoid()}>
            Edit
          </Button>
        </S.Container>
      </Section>
      <Section
        variant={SectionVariant.PRIMARY}
        customContentStyling={{
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <S.Container>
          <S.TextContainer>
            <S.SubSectionTitle>Global No Reply</S.SubSectionTitle>
            <S.SubSectionDescription>
              The fallback response that will trigger if the user says nothing for <MessageDelayPopper /> seconds.
            </S.SubSectionDescription>
          </S.TextContainer>
          <Button variant={Button.Variant.SECONDARY} flat onClick={() => noReplyModal.openVoid()}>
            Edit
          </Button>
        </S.Container>
      </Section>
    </>
  );
};

export default GeneralSettingsNoMatchNoReplySection;
