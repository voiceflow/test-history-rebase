import { Request } from '@voiceflow/general-types';
import React from 'react';

import { isIOS } from '@/config';
import { Permission } from '@/config/permissions';
import * as PrototypeDuck from '@/ducks/prototype';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useASR, useCanASR, useDidUpdateEffect, useGuestPermission, useSpeechRecognition, useTeardown } from '@/hooks';
import { UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import ASRSpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRSpeechBar';
import { usePrototype, useResetPrototype, useStartPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototype/components/ChatDialog';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';

import Footer from '../Footer';
import Layout from '../Layout';
import SplashScreen from '../SplashScreen';
import Visuals from '../Visuals';
import fakeAudio from './fakeAudio';

type PrototypeProps = {
  settings: PrototypeDuck.PrototypeSettings;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({ status, isMuted, settings, autoplay, updatePrototype }) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();
  const [canUseASR] = useCanASR();
  const [isCustomizedPrototypeAllowed] = useGuestPermission(settings.plan, Permission.CUSTOMIZE_PROTOTYPE);

  const [input, setInput] = React.useState<string>('');

  const locale = settings.locales[0];
  const isVisuals = settings.layout === PrototypeDuck.PrototypeLayout.VOICE_VISUALS;

  const { status: prototypeMachineStatus, messages, interactions, onInteraction, onPlay, audio } = usePrototype({
    debug: false,
    isPublic: true,
    waitVisuals: isVisuals,
    prototypeStatus: status,
  });

  const isVoicePrototype = React.useMemo(
    () => [PrototypeDuck.PrototypeLayout.VOICE_VISUALS, PrototypeDuck.PrototypeLayout.VOICE_DIALOG].includes(settings.layout),
    [settings.layout]
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
  } = useSpeechRecognition({ locale, onTranscript: onInteraction, askOnSetup: isVoicePrototype });

  const { onStopListening: onStopListeningASR, onStartListening: onStartListeningASR, listening: listeningASR } = useASR({
    onTranscript: onInteraction,
    locale,
  });

  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const isIdle = status === PrototypeDuck.PrototypeStatus.IDLE;
  const isFinished = status === PrototypeDuck.PrototypeStatus.ENDED;

  const sendInteraction = (customInput: string | Request) => {
    onInteraction(customInput);
    setInput('');
  };

  const resetState = () => {
    resetPrototype();
    setInput('');
  };

  const onMute = () => updatePrototype({ muted: !isMuted });

  const onStart = () => {
    if (isIOS) {
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
          colorScheme={brandColor}
          isMobile={isMobile}
          isVisuals={isVisuals}
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
              onTranscript={onInteraction}
              locale={locale}
              onCheckMicrophonePermission={onCheckMicrophonePermission}
              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
            />
          ) : (
            <UncontrolledSpeechBar
              disabled={isIdle}
              isListening={isListening}
              isSupported={isSpeechSpeechRecognitionSupported}
              finalTranscript={finalTranscript}
              onStopListening={onStopListening}
              onStartListening={onStartListening}
              interimTranscript={interimTranscript}
              onCheckMicrophonePermission={onCheckMicrophonePermission}
              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
              colorScheme={brandColor}
            />
          )}
        </Footer>
      )}
      colorScheme={brandColor}
    >
      {({ isMobile, isFullScreen }) =>
        isVisuals ? (
          <Visuals
            listeningASR={listeningASR}
            isMobile={isMobile}
            isFullScreen={isFullScreen}
            onStopListening={isMobile ? onStopListeningASR : onStopListening}
            onStartListening={isMobile ? onStartListeningASR : onStartListening}
          />
        ) : (
          <ChatDialog
            locale={locale}
            input={input}
            onStart={onStart}
            color={brandColor}
            avatarURL={isCustomizedPrototypeAllowed ? settings.avatar : undefined}
            layout={settings.layout}
            onMute={onMute}
            isIdle={isIdle}
            onSend={sendInteraction}
            isMuted={isMuted}
            onReset={resetState}
            onPlay={onPlay}
            messages={messages}
            isMobile={isMobile}
            isLoading={isLoading}
            testEnded={isFinished}
            isListening={isListening}
            interactions={interactions}
            onInputChange={setInput}
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
};

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps))(Prototype) as React.FC<PrototypeProps>;
