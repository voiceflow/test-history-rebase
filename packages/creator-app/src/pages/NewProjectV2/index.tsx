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
import { useDispatch, useModelTracking, useTrackingEvents } from '@/hooks';
import { NLUImportModel } from '@/models';
import LOCALE_MAP from '@/services/LocaleMap';
import {
  isAlexaPlatform,
  isDialogflowPlatform,
  isGooglePlatform,
  isPlatformWithInvocationName,
  isVoiceflowNLUOnlyPlatform,
  isVoiceflowPlatform,
} from '@/utils/typeGuards';

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
    nlu: null as Nullable<NLU.Constants.NLUType>,
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

  const [trackingEvents] = useTrackingEvents();
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
      type: value.type,
      platform: value.platform,
      nlu: isVoiceflowNLUOnlyPlatform(value.platform) ? NLU.Constants.NLUType.VOICEFLOW : null,
    });
  };

  const onNLUSelect = (value: NLU.Constants.NLUType | null) => {
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
  const isStateValid = (state: State): state is Omit<State, 'type' | 'platform'> & NonNullishRecord<Pick<State, 'type' | 'platform'>> => {
    if (!state.type || !state.platform) {
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

    const platformType = isVoiceflowPlatform(state.platform) ? state.nlu : state.platform;

    const languageToUse: AnyLanguage = state.language || (getDefaultLanguage(platformType) as AnyLanguage);
    const alexaLocalesToUse: AnyLocale[] = state.alexaLocales || (getDefaultLanguage(platformType) as AnyLocale[]);

    try {
      onToggleCreating(true);

      const project = await createProject({
        name: DEFAULT_PROJECT_NAME,
        listID,
        platform: platformType!,
        language: getLanguage(languageToUse!, alexaLocalesToUse, platformType!),
        onboarding: false,
        templateTag: isVoiceflowPlatform(state.platform) ? state.type : 'default',
      });

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(platformType)) {
        await updateAlexaMeta(project.versionID, alexaLocalesToUse as [AlexaConstants.Locale, ...AlexaConstants.Locale[]], state.invocationName);
      } else if (isGooglePlatform(platformType)) {
        await updateGoogleMeta(project.versionID, languageToUse as GoogleConstants.Language, state.invocationName);
      } else if (isDialogflowPlatform(platformType)) {
        await updateDialogFlowMeta(project.versionID, languageToUse as DFESConstants.Language);
      } else {
        await updateGeneralMeta(project.versionID, languageToUse as VoiceflowConstants.Locale);
      }

      if (state.importedModel && platformType && NLU.Config.get(platformType).nlps[0].import) {
        await client.version.patchMergeIntentsAndSlots(project.versionID, state.importedModel);

        modelImportTracking(platformType, state.importedModel, trackingEvents, project.id);
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
