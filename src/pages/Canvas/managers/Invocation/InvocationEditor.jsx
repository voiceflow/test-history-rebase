import React from 'react';

import Input from '@/components/Input';
import Section from '@/components/Section';
import { BlockText, Link } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { getAmazonInvocationNameError, getGoogleInvocationNameError } from '@/ducks/publish/utilsV2';
import * as Skill from '@/ducks/skill';
import { saveInvocationName, saveProjectName } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useFeature, useSyncedSmartReducerV2, useTeardown } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import { withHeaderActions } from '@/pages/Canvas/components/EditorSidebar/hocs';
import { compose } from '@/utils/functional';
import { getPlatformValue } from '@/utils/platform';

export const InvocationEditor = ({ platform, projectName, invocationName, updateInvName, locales, saveInvocationName, saveProjectName }) => {
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const [state, stateAPI] = useSyncedSmartReducerV2({
    error: '',
    invocationName: getPlatformValue(
      platform,
      {
        [PlatformType.ALEXA]: invocationName || '',
        [PlatformType.GOOGLE]: invocationName || projectName || '',
      },
      ''
    ),
  });

  const getError = getPlatformValue(
    platform,
    {
      [PlatformType.ALEXA]: getAmazonInvocationNameError,
      [PlatformType.GOOGLE]: getGoogleInvocationNameError,
    },
    () => '' // eslint-disable-line lodash/prefer-constant
  );

  const onChange = ({ target }) => {
    stateAPI.update({
      error: '',
      invocationName: target.value,
    });
  };

  const onBlur = () => {
    const error = getError(state.invocationName, locales);

    if (!state.invocationName) {
      stateAPI.update({
        error: '',
        invocationName,
      });
    } else if (!error) {
      stateAPI.error.set('');

      if (dataRefactor.isEnabled) {
        platform === PlatformType.GOOGLE ? saveProjectName(state.invocationName) : saveInvocationName(state.invocationName);
      } else {
        updateInvName(state.invocationName);
      }
    } else {
      stateAPI.error.set(error);
    }
  };

  useTeardown(() => {
    const error = getError(state.invocationName, locales);

    if (!error) {
      updateInvName(state.invocationName);
    }
  }, [state.invocationName]);

  return (
    <Content>
      <Section>
        <FormControl label="Invocation Name">
          <Input value={state.invocationName} error={!!state.error} onBlur={onBlur} onChange={onChange} placeholder="Invocation Name" />
        </FormControl>

        <BlockText fontSize="13px" color={state.error ? '#E91E63' : '#62778c'}>
          {state.error ||
            getPlatformValue(
              platform,
              {
                [PlatformType.ALEXA]: (
                  <>
                    The name users will say to interact with your Alexa Skill. This must comply with the{' '}
                    <Link href="https://developer.amazon.com/en-US/docs/alexa/custom-skills/choose-the-invocation-name-for-a-custom-skill.html#cert-invocation-name-req">
                      guidelines
                    </Link>
                    .
                  </>
                ),
                [PlatformType.GOOGLE]: (
                  <>
                    The name users will say or type to interact with your Google Action. This must comply with the{' '}
                    <Link href="https://developers.google.com/assistant/console/policies/general-policies#name_requirements">guidelines</Link>.
                  </>
                ),
              },
              ''
            )}
        </BlockText>
      </Section>
    </Content>
  );
};

const mapStateToProps = {
  locales: Skill.activeLocalesSelector,
  platform: Skill.activePlatformSelector,
  projectName: Skill.activeProjectNameSelector,
  invocationName: Skill.invNameSelector,
};

const mapDispatchToProps = {
  updateInvName: Skill.updateInvName,
  saveProjectName,
  saveInvocationName,
};

export default compose(withHeaderActions([]), connect(mapStateToProps, mapDispatchToProps))(InvocationEditor);
