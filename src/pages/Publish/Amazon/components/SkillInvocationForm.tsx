import React from 'react';
import { useSelector } from 'react-redux';
import { FormGroup, Label } from 'reactstrap';

import TextInput from '@/components/Form/TextInput';
import Multiple from '@/components/Forms/Multiple';
import * as Version from '@/ducks/version';
import { useDispatch, useLinkedState } from '@/hooks';
import { getTargetValue } from '@/utils/dom';
import { arrayStringReplace } from '@/utils/string';

import { useValidator } from '../hooks';

const SkillInvocationForm: React.FC = () => {
  const prevInvocationName = useSelector(Version.alexa.activeInvocationNameSelector);
  const invocations = useSelector(Version.alexa.activeInvocationsSelector);
  const [invocationName, setInvocationName] = useLinkedState(prevInvocationName);
  const [invocationNameError, invocationNameValidator] = useValidator('invocationName', (invocationName: string) =>
    invocationName ? false : 'Invocation name is required.'
  );
  const savePublishing = useDispatch(Version.alexa.savePublishing);

  const saveInvocationName = React.useCallback(
    () =>
      invocationNameValidator((nextInvocationName) => {
        if (prevInvocationName) {
          const nextInvocations = arrayStringReplace(prevInvocationName, nextInvocationName, invocations);

          savePublishing({
            invocationName: nextInvocationName,
            invocations: nextInvocations,
          });
        } else {
          savePublishing({
            invocationName: nextInvocationName,
            invocations: [`open ${nextInvocationName}`, `start ${nextInvocationName}`, `launch ${nextInvocationName}`],
          });
        }
      })(invocationName ?? ''),
    [prevInvocationName, invocationName, invocations]
  );

  return (
    <>
      <FormGroup className="mb-4">
        <Label className="publish-label">Invocation Name</Label>
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
      </FormGroup>

      <FormGroup className="mb-4">
        <Label className="publish-label">Invocations</Label>
        <Multiple
          max={3}
          add="Add Invocation"
          list={invocations}
          prepend="Alexa,"
          placeholder={`open/start/launch ${invocationName}`}
          update={(invocations: string[]) => savePublishing({ invocations })}
        />
      </FormGroup>
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
