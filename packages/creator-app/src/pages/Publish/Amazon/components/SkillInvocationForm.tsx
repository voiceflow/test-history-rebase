import { Box, Label } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import TextInput from '@/components/Form/TextInput';
import Multiple from '@/components/Forms/Multiple';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useLinkedState } from '@/hooks';
import { getTargetValue } from '@/utils/dom';
import { arrayStringReplace } from '@/utils/string';

import { useValidator } from '../hooks';

const SkillInvocationForm: React.FC = () => {
  const prevInvocationName = useSelector(VersionV2.active.alexa.invocationNameSelector);
  const invocations = useSelector(VersionV2.active.alexa.invocationsSelector);
  const [invocationName, setInvocationName] = useLinkedState(prevInvocationName);
  const [invocationNameError, invocationNameValidator] = useValidator('invocationName', (invocationName: string) =>
    invocationName ? false : 'Invocation name is required.'
  );
  const patchPublishing = useDispatch(Version.alexa.patchPublishing);

  const saveInvocationName = React.useCallback(
    () =>
      invocationNameValidator((nextInvocationName) => {
        const nextInvocations = prevInvocationName
          ? arrayStringReplace(prevInvocationName, nextInvocationName, invocations)
          : [`open ${nextInvocationName}`, `start ${nextInvocationName}`, `launch ${nextInvocationName}`];

        patchPublishing({
          invocationName: nextInvocationName,
          invocations: nextInvocations,
        });
      })(invocationName ?? ''),
    [prevInvocationName, invocationName, invocations]
  );

  return (
    <>
      <Box mb={24}>
        <Label>Invocation Name</Label>
        <TextInput
          type="text"
          name="invocationName"
          placeholder="Enter an invocation name"
          value={invocationName}
          onChange={getTargetValue(setInvocationName)}
          onBlur={saveInvocationName}
          touched={!!invocationNameError}
          error={invocationNameError}
        />
      </Box>

      <Box mb={24}>
        <Label>Invocations</Label>
        <Multiple
          max={3}
          add="Add Invocation"
          list={invocations}
          prepend="Alexa,"
          placeholder={`open/start/launch ${invocationName}`}
          update={(invocations: string[]) => patchPublishing({ invocations })}
        />
      </Box>
    </>
  );
};

export default SkillInvocationForm;

export const SkillInvocationDescription: React.FC = () => (
  <>
    <div className="publish-info">
      <p className="mb-0 helper-text">
        <b>Invocation Name</b> is what users will use to open your Skill. For example, "<i>Tiny Tales</i>".
      </p>
    </div>
    <div className="publish-info">
      <p className="helper-text">
        <b>Invocations</b> are the various phrases that will open your Skill.
      </p>
    </div>
  </>
);
