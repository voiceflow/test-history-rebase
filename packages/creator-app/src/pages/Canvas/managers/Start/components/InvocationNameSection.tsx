import { AlexaUtils } from '@voiceflow/alexa-types';
import { GoogleUtils } from '@voiceflow/google-types';
import { Input } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import { PlatformContext, ProjectTypeContext } from '@/pages/Project/contexts';
import { getSettingsMetaProps } from '@/pages/Settings/constants';
import { getPlatformValue } from '@/utils/platform';

const InvocationNameSection: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;
  const projectType = React.useContext(ProjectTypeContext)!;

  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const locales = useSelector(VersionV2.active.localesSelector);
  const invocationName = useSelector(VersionV2.active.invocationNameSelector);

  const { descriptors } = getSettingsMetaProps(platform, projectType);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');

  const invocationError =
    newInvocation &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      platform,
      {
        [VoiceflowConstants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      () => null
    )(newInvocation, locales);

  return (
    <Section
      header="Invocation Name"
      variant={SectionVariant.QUATERNARY}
      contentSuffix={
        invocationError && newInvocation
          ? () => <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage>
          : descriptors.invocationNameShort
      }
      isDividerNested
      customContentStyling={{ paddingBottom: '20px' }}
    >
      <Input
        error={!!invocationError}
        value={newInvocation}
        onBlur={() => !invocationError && updateInvocationName(newInvocation)}
        placeholder="Enter an invocation name"
        onChangeText={setNewInvocation}
      />
    </Section>
  );
};

export default InvocationNameSection;
