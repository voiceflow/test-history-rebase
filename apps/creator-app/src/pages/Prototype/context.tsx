import { BaseButton } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import * as Transcripts from '@/ducks/transcript';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import type { ProtoConfigType, PrototypeActions, PrototypeAllTypes, PrototypeRuntimeState } from './types';

const defaultPrototypeContext: PrototypeAllTypes = {
  config: {
    buttons: BaseButton.ButtonsLayout.STACKED,
    autoplay: true,
    showButtons: true,
    prototypeColor: 'blue',
    prototypeAvatar: '',
    locales: [''],
    platform: Platform.Constants.PlatformType.VOICEFLOW,
    projectType: Platform.Constants.ProjectType.VOICE,
    isMuted: false,
    durationMilliseconds: 0,
    debug: false,
    intent: true,
    isGuided: false,
    showVisuals: true,
  },
  state: {
    status: PrototypeStatus.IDLE,
    activePaths: {},
    contextHistory: [],
    visualDataHistory: [],
    activeDiagramID: null,
    flowIDHistory: [],
    contextStep: 0,
  },
  actions: {
    // eslint-disable-next-line no-empty-function
    updatePrototype: () => {},
    // eslint-disable-next-line no-empty-function
    savePrototypeSession: () => {},
    getLinksByPortID: undefined,
    updatePrototypeVisualsData: undefined,
    fetchContext: undefined,
    setActiveDiagramID: undefined,
    updatePrototypeStatus: undefined,
    setError: undefined,
  },
};

export const PrototypeContext = React.createContext<PrototypeAllTypes>(defaultPrototypeContext);
export const { Consumer: PrototypeConsumer } = PrototypeContext;

export const PrototypeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector);
  const status = useSelector(Prototype.prototypeStatusSelector);
  const autoplay = useSelector(Prototype.prototypeAutoplaySelector);
  const showButtons = useSelector(Prototype.prototypeShowButtonsSelector);
  const prototypeColor = useSelector(Prototype.prototypeBrandColorSelector);
  const prototypeAvatar = useSelector(Prototype.prototypeAvatarSelector);
  const locales = useSelector(VersionV2.active.localesSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const config = useSelector(Recent.recentPrototypeSelector);
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const isMuted = useSelector(Prototype.prototypeMutedSelector);
  const savePrototypeSession = useDispatch(Transcripts.createTranscript);
  const durationMilliseconds = useSelector(VersionV2.active.voiceflow.chat.messageDelaySelector);

  const activePaths = useSelector(Prototype.activePathsSelector);
  const getLinksByPortID = useSelector(CreatorV2.getLinksByPortIDSelector);
  const contextHistory = useSelector(Prototype.prototypeContextHistorySelector);
  const visualDataHistory = useSelector(Prototype.prototypeVisualDataHistorySelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const flowIDHistory = useSelector(Prototype.prototypeFlowIDHistorySelector);
  const contextStep = useSelector(Prototype.prototypeContextStepSelector);
  const updatePrototypeVisualsData = useDispatch(Prototype.updatePrototypeVisualData);
  const fetchContext = useDispatch(Prototype.fetchContext);
  const setActiveDiagramID = useDispatch(Session.setActiveDiagramID);
  const updatePrototypeVisualsDataHistory = useDispatch(Prototype.updatePrototypeVisualDataHistory);
  const updatePrototypeStatus = useDispatch(Prototype.updatePrototypeStatus);

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const setError = React.useCallback((error: string) => errorModal.open({ error }), [errorModal.open]);

  const protoConfig = useContextApi<ProtoConfigType>({
    buttons,
    autoplay,
    showButtons,
    prototypeColor,
    prototypeAvatar,
    isMuted,
    durationMilliseconds: durationMilliseconds ?? 0,
    locales,
    platform,
    projectType,
    ...config,
  });

  const state = useContextApi<PrototypeRuntimeState>({
    status,
    activePaths,
    contextHistory,
    activeDiagramID,
    flowIDHistory,
    contextStep,
    visualDataHistory,
  });

  const actions = useContextApi<PrototypeActions>({
    updatePrototype,
    savePrototypeSession,
    getLinksByPortID,
    updatePrototypeVisualsData,
    fetchContext,
    setActiveDiagramID,
    updatePrototypeVisualsDataHistory,
    updatePrototypeStatus,
    setError,
  });

  const api = useContextApi({
    state,
    actions,
    config: protoConfig,
  });

  return <PrototypeContext.Provider value={api}>{children}</PrototypeContext.Provider>;
};
