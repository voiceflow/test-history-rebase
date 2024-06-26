import * as Realtime from '@voiceflow/realtime-sdk';
import { IS_IOS, toast, useDidUpdateEffect, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { PrototypeLayout, PrototypeStatus } from '@/constants/prototype';
import * as PrototypeDuck from '@/ducks/prototype';
import { useSelector, useTeardown } from '@/hooks';
import { useASR, useCanASR, useSpeechRecognition } from '@/hooks/speech-recognition.hook';
import { UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import ASRSpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRSpeechBar';
import { usePrototype, useResetPrototype, useStartPublicPrototype } from '@/pages/Prototype/hooks';
import type { OnInteraction, PrototypeAllTypes } from '@/pages/Prototype/types';
import { PMStatus } from '@/pages/Prototype/types';
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

const Prototype: React.FC<PrototypeProps & PrototypeAllTypes> = ({
  config,
  state,
  actions,
  settings,
  onInteract,
  globalDelayInMilliseconds,
}) => {
  const startPrototype = useStartPublicPrototype(settings);
  const resetPrototype = useResetPrototype();
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

  const asr = useASR({ locale, enabled: isVoicePrototype, onTranscript });
  const canUseASR = useCanASR();
  const speechRecognition = useSpeechRecognition({ locale, onTranscript, askOnSetup: isVoicePrototype });

  const checkPMStatus = React.useCallback(
    (...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus),
    [prototypeMachineStatus]
  );

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

  return (
    <Layout
      layout={layout}
      isVisuals={isVisuals}
      isListening={canUseASR ? asr.listening : speechRecognition.isListening}
      renderSplashScreen={({ isMobile }) => (
        <SplashScreen
          logoURL={settings.brandImage}
          onStart={onStart}
          isMobile={isMobile}
          isVisuals={isVisuals}
          colorScheme={settings.brandColor}
          projectName={settings.projectName}
          hideVFBranding
          withStartButton={isIdle}
        />
      )}
      splashScreenPassed={!isIdle}
      renderVisualsFooter={({ toggleFullScreen }) => (
        <Footer onMute={onMute} isMuted={isMuted} onReset={resetPrototype} onFullScreen={toggleFullScreen}>
          {canUseASR ? (
            <ASRSpeechBar
              listening={asr.listening}
              onStopListening={asr.onStopListening}
              onStartListening={asr.onStartListening}
              processingTranscription={asr.processingTranscription}
              onCheckMicrophonePermission={speechRecognition.onCheckMicrophonePermission}
              isMicrophonePermissionGranted={speechRecognition.isMicrophonePermissionGranted}
            />
          ) : (
            <UncontrolledSpeechBar
              disabled={isIdle}
              isListening={speechRecognition.isListening}
              isSupported={speechRecognition.isSupported}
              colorScheme={settings.brandColor}
              finalTranscript={speechRecognition.finalTranscript}
              onStopListening={speechRecognition.onStopListening}
              onStartListening={speechRecognition.onStartListening}
              interimTranscript={speechRecognition.interimTranscript}
              onCheckMicrophonePermission={speechRecognition.onCheckMicrophonePermission}
              isMicrophonePermissionGranted={speechRecognition.isMicrophonePermissionGranted}
            />
          )}
        </Footer>
      )}
      colorScheme={settings.brandColor}
    >
      {({ isMobile, isFullScreen }) =>
        isVisuals ? (
          <Visuals
            isMobile={isMobile}
            listening={canUseASR ? asr.listening : speechRecognition.isListening}
            isFullScreen={isFullScreen}
            onStopListening={canUseASR ? asr.onStopListening : speechRecognition.onStopListening}
            onStartListening={canUseASR ? asr.onStartListening : speechRecognition.onStartListening}
          />
        ) : (
          <ChatDialog
            audio={audioController.audio}
            input={input}
            color={settings.brandColor}
            layout={layout}
            onMute={onMute}
            isIdle={isIdle}
            onPause={onPause}
            onStart={onStart}
            buttons={settings.buttons}
            isMuted={isMuted}
            onReset={resetState}
            pmStatus={prototypeMachineStatus}
            messages={messages}
            isMobile={isMobile}
            avatarURL={settings.avatar}
            isLoading={isLoading}
            testEnded={isFinished}
            onContinue={onContinue}
            onStepBack={onStepBack}
            buttonsOnly={settings.buttonsOnly}
            isListening={canUseASR ? asr.listening : speechRecognition.isListening}
            interactions={interactions}
            onInputChange={setInput}
            onInteraction={sendInteraction}
            prototypeStatus={status}
            finalTranscript={speechRecognition.finalTranscript}
            onStopListening={canUseASR ? asr.onStopListening : speechRecognition.onStopListening}
            onStartListening={canUseASR ? asr.onStartListening : speechRecognition.onStartListening}
            interimTranscript={speechRecognition.interimTranscript}
            processingTranscription={asr.processingTranscription}
            onCheckMicrophonePermission={speechRecognition.onCheckMicrophonePermission}
            isMicrophonePermissionGranted={speechRecognition.isMicrophonePermissionGranted}
            isSpeechSpeechRecognitionSupported={speechRecognition.isSupported}
          />
        )
      }
    </Layout>
  );
};

export default Prototype;
