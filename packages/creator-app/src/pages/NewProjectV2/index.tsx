import { NonNullishRecord, Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Box, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as NLU from '@/config/nlu';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch, useModelTracking } from '@/hooks';
import { NLUImportModel } from '@/models';
import { isPlatformWithInvocationName, isVoiceflowPlatform } from '@/utils/typeGuards';

import { ChannelSection, ChannelValue, Container, Footer, InvocationNameSection, LanguageSection, NLUSection } from './components';
import { Upcoming } from './constants';
import { useUpdateChannelMeta } from './hooks';

interface NewProjectProps {
  onClose: VoidFunction;
  listID?: string;
  onToggleCreating: (val: boolean) => void;
}

const NewProject: React.FC<NewProjectProps> = ({ listID, onClose, onToggleCreating }) => {
  const [state, stateAPI] = useSmartReducerV2({
    nlu: null as Nullable<Platform.Constants.NLUType>,
    type: null as Nullable<Platform.Constants.ProjectType>,
    locales: [] as string[],
    platform: null as Nullable<Platform.Constants.PlatformType>,
    nluError: '',
    channelError: '',
    importedModel: null as Nullable<NLUImportModel>,
    invocationName: '',
    invocationNameError: '',
  });

  const projectConfig = Platform.Config.getTypeConfig({
    type: state.type,
    platform: Platform.Config.isSupported(state.nlu) ? state.nlu : state.platform,
  });

  const onUpdateChannelMeta = useUpdateChannelMeta();

  const modelImportTracking = useModelTracking();

  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  const getInvocationNameError = (invocationName: string) => {
    if (!projectConfig.project.invocationName) return '';

    const locales = projectConfig.project.locale.isLanguage ? projectConfig.utils.locale.fromLanguage(state.locales[0]) : state.locales;

    return projectConfig.utils.invocationName.validate({ value: invocationName, locales }) || '';
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
      locales: [],
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

    const defaultedLocales = state.locales.length ? state.locales : projectConfig.project.locale.defaultLocales;

    try {
      onToggleCreating(true);

      const project = await createProject({
        name: 'Untitled',
        listID,
        nluType: state.nlu,
        platform: state.platform,
        language: projectConfig.project.locale.labelMap[defaultedLocales[0]],
        onboarding: false,
        templateTag: isVoiceflowPlatform(state.platform) ? state.type : 'default',
      });

      await onUpdateChannelMeta({
        type: state.type,
        locales: projectConfig.project.locale.isLanguage ? projectConfig.utils.locale.fromLanguage(defaultedLocales[0]) : defaultedLocales,
        platform: Platform.Config.isSupported(state.nlu) ? state.nlu : state.platform,
        versionID: project.versionID,
        projectID: project.id,
        projectName: project.name,
        invocationName: state.invocationName,
      });

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
              description={projectConfig.project.invocationName?.description}
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
            type={state.type}
            locales={state.locales}
            platform={Platform.Config.isSupported(state.nlu) ? state.nlu : state.platform}
            onLocalesChange={stateAPI.locales.set}
          />
        </Container>
      </Box>

      <Footer onCreate={onCreate} onCancel={onClose} />
    </>
  );
};

export default NewProject;
