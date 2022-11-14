import { AlexaConstants, AlexaUtils } from '@voiceflow/alexa-types';
import { NonNullishRecord, Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleUtils } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import { Box, toast, useSmartReducerV2 } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import * as NLU from '@/config/nlu';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch, useModelTracking } from '@/hooks';
import { NLUImportModel } from '@/models';
import LOCALE_MAP from '@/services/LocaleMap';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform, isPlatformWithInvocationName, isVoiceflowPlatform } from '@/utils/typeGuards';

import { ChannelSection, ChannelValue, Container, Footer, InvocationNameSection, LanguageSection, NLUSection } from './components';
import { DEFAULT_PROJECT_NAME, getDefaultLanguage, getLanguage, PLATFORM_PROJECT_META_MAP, Upcoming } from './constants';
import { AnyLanguage, AnyLocale } from './types';
import { updatePlatformMetaCalls } from './updatePlatformMeta';

interface NewProjectProps {
  onClose: VoidFunction;
  listID?: string;
  onToggleCreating: (val: boolean) => void;
}

const NewProject: React.FC<NewProjectProps> = ({ listID, onClose, onToggleCreating }) => {
  const [state, stateAPI] = useSmartReducerV2({
    nlu: null as Nullable<Platform.Constants.NLUType>,
    type: null as Nullable<Platform.Constants.ProjectType>,
    platform: null as Nullable<Platform.Constants.PlatformType>,
    language: null as Nullable<AnyLanguage>,
    nluError: '',
    alexaLocales: [LOCALE_MAP[0].value] as AnyLocale[],
    channelError: '',
    importedModel: null as Nullable<NLUImportModel>,
    invocationName: '',
    invocationNameError: '',
  });

  const modelImportTracking = useModelTracking();

  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  const { updateDialogFlowMeta, updateGeneralMeta, updateAlexaMeta, updateGoogleMeta } = updatePlatformMetaCalls();

  const getInvocationNameError = (invocationName: string) => {
    let error = '';

    if (invocationName && state.platform === Platform.Constants.PlatformType.ALEXA) {
      error = AlexaUtils.getInvocationNameError(invocationName, state.alexaLocales) ?? '';
    }

    if (invocationName && state.platform === Platform.Constants.PlatformType.GOOGLE) {
      error = GoogleUtils.getInvocationNameError(invocationName, GoogleConstants.LanguageToLocale[state.language as GoogleConstants.Language]) ?? '';
    }

    return error;
  };

  const onChannelSelect = (value: ChannelValue | null) => {
    stateAPI.reset();

    if (Upcoming.Config.isSupported(value?.platform) || !value) return;

    stateAPI.update({
      nlu: Platform.Config.get(value.platform).supportedNLUs[0],
      type: value.type,
      platform: value.platform,
    });
  };

  const onNLUSelect = (value: Platform.Constants.NLUType | null) => {
    stateAPI.update({
      nlu: value,
      language: null,
      nluError: '',
      importedModel: null,
    });
  };

  const onInvocationNameChange = (invocationName: string) => {
    stateAPI.update({
      invocationName,
      invocationNameError: getInvocationNameError(invocationName),
    });
  };

  type State = typeof state;
  const isStateValid = (
    state: State
  ): state is Omit<State, 'nlu' | 'type' | 'platform'> & NonNullishRecord<Pick<State, 'nlu' | 'type' | 'platform'>> => {
    if (!state.nlu || !state.type || !state.platform) {
      toast.error('Channel selection required');
      stateAPI.channelError.set('Channel selection required');

      return false;
    }

    if (!isPlatformWithInvocationName(state.platform) && !state.nlu) {
      toast.error('NLU selection required');
      stateAPI.nluError.set(
        'NLU selection is required. If you don’t already use one of these providers we recommend selecting the Voiceflow option.'
      );

      return false;
    }

    if (isPlatformWithInvocationName(state.platform) && !state.invocationName) {
      toast.error('Invocation name required');
      stateAPI.invocationNameError.set('Invocation name is required');

      return false;
    }

    return true;
  };

  const onCreate = async () => {
    if (!isStateValid(state)) return;

    const languageToUse: AnyLanguage = state.language || (getDefaultLanguage(state.platform) as AnyLanguage);
    const alexaLocalesToUse: AnyLocale[] = state.alexaLocales || (getDefaultLanguage(state.platform) as AnyLocale[]);

    try {
      onToggleCreating(true);

      const project = await createProject({
        name: DEFAULT_PROJECT_NAME,
        listID,
        nluType: state.nlu,
        platform: state.platform,
        language: getLanguage(languageToUse, alexaLocalesToUse, state.platform),
        onboarding: false,
        templateTag: isVoiceflowPlatform(state.platform) ? state.type : 'default',
      });

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(state.platform)) {
        await updateAlexaMeta(project.versionID, alexaLocalesToUse as [AlexaConstants.Locale, ...AlexaConstants.Locale[]], state.invocationName);
      } else if (isGooglePlatform(state.platform)) {
        await updateGoogleMeta(project.versionID, languageToUse as GoogleConstants.Language, state.invocationName);
      } else if (isDialogflowPlatform(state.nlu as Platform.Constants.PlatformType)) {
        await updateDialogFlowMeta(project.versionID, languageToUse as DFESConstants.Language);
      } else {
        await updateGeneralMeta(project.versionID, languageToUse as VoiceflowConstants.Locale);
      }

      if (state.importedModel && NLU.Config.get(state.nlu).nlps[0].import) {
        await client.version.patchMergeIntentsAndSlots(project.versionID, state.importedModel);

        modelImportTracking({ nluType: state.nlu, projectID: project.id, importedModel: state.importedModel });
      }

      onClose();
      onToggleCreating(false);
      redirectToDomain({ versionID: project.versionID });
    } catch {
      toast.error('Failed to create project, please try again later');
    }
  };

  return (
    <>
      <Box fullWidth overflow="auto">
        <Container>
          <ChannelSection
            value={state.type && state.platform ? { type: state.type, platform: state.platform } : null}
            error={state.channelError}
            onSelect={onChannelSelect}
          />

          {isPlatformWithInvocationName(state.platform) ? (
            <InvocationNameSection
              key={state.platform}
              value={state.invocationName}
              error={state.invocationNameError}
              onChange={onInvocationNameChange}
              description={PLATFORM_PROJECT_META_MAP[state.platform]?.invocationDescription ?? ''}
            />
          ) : (
            <NLUSection
              value={state.nlu}
              error={state.nluError}
              platform={state.platform}
              onSelect={onNLUSelect}
              importModel={state.importedModel}
              onImportModel={stateAPI.importedModel.set}
            />
          )}

          <LanguageSection
            nlu={state.nlu}
            platform={state.platform}
            language={state.language}
            setLanguage={stateAPI.language.set}
            alexaLocales={state.alexaLocales}
            setAlexaLocales={stateAPI.alexaLocales.set}
          />
        </Container>
      </Box>

      <Footer onCreate={onCreate} onCancel={onClose} />
    </>
  );
};

export default NewProject;
