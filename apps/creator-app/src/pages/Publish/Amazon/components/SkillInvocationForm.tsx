import { Utils } from '@voiceflow/common';
import { Box, Label, Text } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import TextInput from '@/components/Form/TextInput';
import Multiple from '@/components/Forms/Multiple';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useLinkedState } from '@/hooks';
import { withTargetValue } from '@/utils/dom';

import { useValidator } from '../hooks';

const SkillInvocationForm: React.FC = () => {
  const storedInvocationName = useSelector(VersionV2.active.invocationNameSelector);
  const storedInvocationNameSamples = useSelector(VersionV2.active.invocationNameSamplesSelector);

  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const [invocationName, setInvocationName] = useLinkedState(storedInvocationName ?? '');
  const [invocationNameError, invocationNameValidator] = useValidator('invocationName', (invocationName: string) =>
    invocationName ? false : 'Invocation name is required.'
  );

  const onUpdateInvocationName = (nextInvocationName: string) =>
    updateInvocationName(
      nextInvocationName,
      storedInvocationName
        ? Utils.string.arrayStringReplace(storedInvocationName, nextInvocationName, storedInvocationNameSamples)
        : [`open ${nextInvocationName}`, `start ${nextInvocationName}`, `launch ${nextInvocationName}`]
    );

  const onUpdateWithValidation = () => invocationNameValidator(onUpdateInvocationName)(invocationName);

  return (
    <>
      <Box mb={24}>
        <Label>Invocation Name</Label>

        <TextInput
          type="text"
          name="invocationName"
          value={invocationName}
          error={invocationNameError}
          onBlur={onUpdateWithValidation}
          touched={!!invocationNameError}
          onChange={withTargetValue(setInvocationName)}
          placeholder="Enter an invocation name"
        />
      </Box>

      <Box mb={24}>
        <Label>Invocations</Label>

        <Multiple
          max={3}
          add="Add Invocation"
          list={storedInvocationNameSamples}
          update={(invocationNameSamples) => updateInvocationName(invocationName, invocationNameSamples)}
          prepend="Alexa,"
          placeholder={`open/start/launch ${invocationName}`}
        />
      </Box>
    </>
  );
};

export default SkillInvocationForm;

export const SkillInvocationDescription: React.FC = () => (
  <>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        <b>Invocation Name</b> is what users will use to open your Skill. For example, "<i>Tiny Tales</i>".
      </Text>
    </Box>
    <Box mb={16}>
      <Text color="#8da2b5" fontSize={13}>
        <b>Invocations</b> are the various phrases that will open your Skill.
      </Text>
    </Box>
  </>
);
