import { IS_IOS, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Transcripts from '@/ducks/transcript';
import { compose, connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useASR, useCanASR, useGuestPermission, useSpeechRecognition, useTeardown } from '@/hooks';
import { UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import ASRSpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRSpeechBar';
import { usePrototype, useResetPrototype, useStartPrototype } from '@/pages/Prototype/hooks';
import { OnInteraction, PMStatus } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';
import { ConnectedProps } from '@/types';

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

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({
  status,
  isMuted,
  settings,
  autoplay,
  onInteract,
  updatePrototype,
  savePrototypeSession,
  globalDelayInMilliseconds,
}) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();
  const [canUseASR] = useCanASR();
  const [isCustomizedPrototypeAllowed] = useGuestPermission(settings.plan, Permission.CUSTOMIZE_PROTOTYPE);
  const [input, setInput] = React.useState<string>('');

  const locale = settings.locales[0];
  const isVisuals = settings.layout === PrototypeDuck.PrototypeLayout.VOICE_VISUALS;

  const {
    status: prototypeMachineStatus,
    messages,
    interactions,
    onInteraction,
    onPlay,
    audio,
    onStepBack,
  } = usePrototype({
    debug: false,
    config: {
      debug: false,
      intent: false,
      isGuided: false,
      platform: settings.platform,
    },
    isPublic: true,
    waitVisuals: isVisuals,
    prototypeStatus: status,
    globalDelayInMilliseconds,
  });

  const isVoicePrototype = React.useMemo(
    () => [PrototypeDuck.PrototypeLayout.VOICE_VISUALS, PrototypeDuck.PrototypeLayout.VOICE_DIALOG].includes(settings.layout),
    [settings.layout]
  );

  const onTranscript = React.useCallback(
    (text: string) => {
      onInteract?.();
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

  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING, PMStatus.FAKE_LOADING);
  const isIdle = status === PrototypeDuck.PrototypeStatus.IDLE;
  const isFinished = status === PrototypeDuck.PrototypeStatus.ENDED;

  const sendInteraction: OnInteraction = (interaction) => {
    onInteract?.();
    onInteraction(interaction);
    setInput('');
  };

  const resetState = () => {
    resetPrototype();
    setInput('');
  };

  const onMute = () => updatePrototype({ muted: !isMuted });

  const onStart = () => {
    if (IS_IOS) {
      audio.play(fakeAudio);
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

  useDidUpdateEffect(() => {
    if (isFinished) {
      onStopListening();
      savePrototypeSession();
    }
  }, [isFinished]);

  const brandColor = isCustomizedPrototypeAllowed ? settings.brandColor : undefined;

  return (
    <Layout
      layout={settings.layout}
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
            locale={locale}
            input={input}
            color={brandColor}
            layout={settings.layout}
            onMute={onMute}
            isIdle={isIdle}
            onPlay={onPlay}
            onStart={onStart}
            buttons={settings.buttons}
            isMuted={isMuted}
            onReset={resetState}
            messages={messages}
            isMobile={isMobile}
            avatarURL={isCustomizedPrototypeAllowed ? settings.avatar : undefined}
            isLoading={isLoading}
            testEnded={isFinished}
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

const mapStateToProps = {
  status: PrototypeDuck.prototypeStatusSelector,
  isMuted: PrototypeDuck.prototypeMutedSelector,
  autoplay: PrototypeDuck.prototypeAutoplaySelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
  savePrototypeSession: Transcripts.createTranscript,
};

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps))(Prototype) as React.FC<PrototypeProps>;
