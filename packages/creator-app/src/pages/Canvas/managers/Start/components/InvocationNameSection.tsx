import { AlexaUtils } from '@voiceflow/alexa-types';
import { GoogleUtils } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

const InvocationNameSection: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const locales = useSelector(VersionV2.active.localesSelector);
  const invocationName = useSelector(VersionV2.active.invocationNameSelector);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');

  const invocationError =
    newInvocation &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      platform,
      {
        [Platform.Constants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [Platform.Constants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      () => null
    )(newInvocation, locales);

  return (
    <SectionV2.SimpleSection isAccent>
      <Input
        error={!!invocationError}
        value={newInvocation}
        onBlur={() => !invocationError && updateInvocationName(newInvocation)}
        placeholder="Enter an invocation name"
        onChangeText={setNewInvocation}
      />

      {invocationError && <SectionV2.ErrorMessage>{invocationError}</SectionV2.ErrorMessage>}
    </SectionV2.SimpleSection>
  );
};

export default InvocationNameSection;
