import * as Realtime from '@voiceflow/realtime-sdk';
import { IS_IOS, toast, useDidUpdateEffect, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { PrototypeLayout, PrototypeStatus } from '@/constants/prototype';
import * as PrototypeDuck from '@/ducks/prototype';
import { useASR, useCanASR, useGuestPermission, useSelector, useSpeechRecognition, useTeardown } from '@/hooks';
import { UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import ASRSpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRSpeechBar';
import { usePrototype, useResetPrototype, useStartPublicPrototype } from '@/pages/Prototype/hooks';
import { OnInteraction, PMStatus, PrototypeAllTypes } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';

import Footer from '../Footer';
import Layout from '../Layout';
import SplashScreen from '../SplashScreen';
import Visuals from '../Visuals';
import fakeAudio from './fakeAudio';

interface PrototypeProps {
  settings: PrototypeDuck.PrototypeSettings;
  onInteract?: VoidFunction;
  globalDelayInMilliseconds: number;
}

const Prototype: React.FC<PrototypeProps & PrototypeAllTypes> = ({ config, state, actions, settings, onInteract, globalDelayInMilliseconds }) => {
  const startPrototype = useStartPublicPrototype(settings);
  const resetPrototype = useResetPrototype();
  const [canUseASR] = useCanASR();
  const [isCustomizedPrototypeAllowed] = useGuestPermission(settings.plan, Permission.CUSTOMIZE_PROTOTYPE);
  const interactedRef = React.useRef(false);
  const [input, setInput] = React.useState<string>('');
  const selectedPersonaID = useSelector(PrototypeDuck.prototypeSelectedPersonaID);

  const { isMuted, autoplay } = config;
  const { status } = state;
  const { updatePrototype, savePrototypeSession } = actions;
  const locale = settings.locales[0];
  const isVisuals = settings.layout === PrototypeLayout.VOICE_VISUALS;

  const {
    status: prototypeMachineStatus,
    onPause,
    messages,
    onStepBack,
    onContinue,
    interactions,
    onInteraction,
    audioController,
  } = usePrototype({
    state,
    actions,
    debug: false,
    config: {
      ...config,
      debug: false,
      intent: false,
      isGuided: false,
      platform: settings.platform,
      projectType: settings.projectType,
      showVisuals: false,
    },
    isPublic: true,
    waitVisuals: isVisuals,
    prototypeStatus: status,
    globalDelayInMilliseconds,
  });

  const isVoicePrototype = React.useMemo(
    () => [PrototypeLayout.VOICE_VISUALS, PrototypeLayout.VOICE_DIALOG].includes(settings.layout),
    [settings.layout]
  );

  const handleInteraction = usePersistFunction(async () => {
    if (interactedRef.current) return;

    try {
      interactedRef.current = true;

      const variableState = settings.variableStates.find((variableState) => variableState.id === selectedPersonaID);

      await savePrototypeSession({ persona: variableState });
    } catch {
      toast.error("Couldn't save transcript, please retry.");

      interactedRef.current = false;
    }
  });

  const onTranscript = React.useCallback(
    (text: string) => {
      onInteract?.();
      handleInteraction();
      onInteraction({ request: text });
    },
    [onInteract, onInteraction]
  );

  const {
    isListening,
    isSupported: isSpeechSpeechRecognitionSupported,
    finalTranscript,
    onStopListening,
    onStartListening,
    interimTranscript,
    onCheckMicrophonePermission,
    isMicrophonePermissionGranted,
  } = useSpeechRecognition({ locale, onTranscript, askOnSetup: isVoicePrototype });

  const {
    listening: listeningASR,
    onStopListening: onStopListeningASR,
    onStartListening: onStartListeningASR,
  } = useASR({
    locale,
    enabled: isVoicePrototype,
    onTranscript,
  });

  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);

  const layout = settings.layout ?? Realtime.Utils.platform.getDefaultPrototypeLayout(settings.projectType);

  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.FAKE_LOADING);
  const isIdle = status === PrototypeStatus.IDLE;
  const isFinished = status === PrototypeStatus.ENDED;

  const sendInteraction: OnInteraction = (interaction) => {
    onInteract?.();
    handleInteraction();
    onInteraction(interaction);
    setInput('');
  };

  const resetState = () => {
    interactedRef.current = false;

    resetPrototype();
    setInput('');
  };

  const onMute = () => {
    updatePrototype({ muted: !isMuted });
  };

  const onStart = () => {
    if (IS_IOS) {
      audioController.play(fakeAudio);
    }

    startPrototype();
  };

  useTeardown(() => {
    resetPrototype();
  }, []);

  useDidUpdateEffect(() => {
    if (autoplay) {
      startPrototype();
    }
  }, [autoplay]);

  React.useEffect(() => {
    if (isMuted) {
      audioController.mute();
    }
  }, [isMuted]);

  const brandColor = isCustomizedPrototypeAllowed ? settings.brandColor : undefined;
  return (
    <Layout
      layout={layout}
      isVisuals={isVisuals}
      isListening={isListening}
      renderSplashScreen={({ isMobile }) => (
        <SplashScreen
          logoURL={isCustomizedPrototypeAllowed ? settings.brandImage : undefined}
          onStart={onStart}
          isMobile={isMobile}
          isVisuals={isVisuals}
          colorScheme={brandColor}
          projectName={settings.projectName}
          hideVFBranding={isCustomizedPrototypeAllowed}
          withStartButton={isIdle}
        />
      )}
      splashScreenPassed={!isIdle}
      renderVisualsFooter={({ toggleFullScreen }) => (
        <Footer onMute={onMute} isMuted={isMuted} onReset={resetPrototype} onFullScreen={toggleFullScreen}>
          {canUseASR ? (
            <ASRSpeechBar
              locale={locale}
              onTranscript={onTranscript}
              onCheckMicrophonePermission={onCheckMicrophonePermission}
              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
            />
          ) : (
            <UncontrolledSpeechBar
              disabled={isIdle}
              isListening={isListening}
              isSupported={isSpeechSpeechRecognitionSupported}
              colorScheme={brandColor}
              finalTranscript={finalTranscript}
              onStopListening={onStopListening}
              onStartListening={onStartListening}
              interimTranscript={interimTranscript}
              onCheckMicrophonePermission={onCheckMicrophonePermission}
              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
            />
          )}
        </Footer>
      )}
      colorScheme={brandColor}
    >
      {({ isMobile, isFullScreen }) =>
        isVisuals ? (
          <Visuals
            isMobile={isMobile}
            listeningASR={listeningASR}
            isFullScreen={isFullScreen}
            onStopListening={isMobile ? onStopListeningASR : onStopListening}
            onStartListening={isMobile ? onStartListeningASR : onStartListening}
          />
        ) : (
          <ChatDialog
            pmStatus={prototypeMachineStatus}
            audio={audioController.audio}
            locale={locale}
            input={input}
            color={brandColor}
            layout={layout}
            buttonsOnly={settings.buttonsOnly}
            onMute={onMute}
            isIdle={isIdle}
            onPause={onPause}
            onStart={onStart}
            buttons={settings.buttons}
            isMuted={isMuted}
            onReset={resetState}
            messages={messages}
            isMobile={isMobile}
            avatarURL={isCustomizedPrototypeAllowed ? settings.avatar : undefined}
            isLoading={isLoading}
            testEnded={isFinished}
            onContinue={onContinue}
            onStepBack={onStepBack}
            isListening={isListening}
            interactions={interactions}
            onInputChange={setInput}
            onInteraction={sendInteraction}
            prototypeStatus={status}
            finalTranscript={finalTranscript}
            onStopListening={onStopListening}
            onStartListening={onStartListening}
            interimTranscript={interimTranscript}
            onCheckMicrophonePermission={onCheckMicrophonePermission}
            isMicrophonePermissionGranted={isMicrophonePermissionGranted}
            isSpeechSpeechRecognitionSupported={isSpeechSpeechRecognitionSupported}
          />
        )
      }
    </Layout>
  );
};

export default Prototype;
