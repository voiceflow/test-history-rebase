import { Utils as AlexaUtils } from '@voiceflow/alexa-types';
import { Constants } from '@voiceflow/general-types';
import { Utils as GoogleUtils } from '@voiceflow/google-types';
import { Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import { getSettingsMetaProps } from '@/pages/Settings/constants';
import { PlatformContext } from '@/pages/Skill/contexts';
import { getTargetValue } from '@/utils/dom';
import { getPlatformValue } from '@/utils/platform';

const InvocationNameSection: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  const saveInvocationName = useDispatch(Version.saveInvocationName);

  const locales = useSelector(Version.activeLocalesSelector);
  const invocationName = useSelector(Version.activeInvocationNameSelector);

  const { descriptors } = getSettingsMetaProps(platform);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');

  const invocationError =
    newInvocation &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      platform,
      {
        [Constants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [Constants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
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
        onBlur={() => !invocationError && saveInvocationName(newInvocation)}
        onChange={getTargetValue(setNewInvocation)}
        placeholder="Enter an invocation name"
      />
    </Section>
  );
};

export default InvocationNameSection;
