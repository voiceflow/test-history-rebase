import * as Platform from '@voiceflow/platform-config';
import { Button } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import MessageDelayPopper from './MessageDelayPopper';
import * as S from './styles';

const GeneralSettingsNoMatchNoReplySection: React.FC = () => {
  const meta = useSelector(ProjectV2.active.metaSelector);
  const { project } = Platform.Config.getTypeConfig(meta);

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
      {project.noReply && (
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
      )}
    </>
  );
};

export default GeneralSettingsNoMatchNoReplySection;
