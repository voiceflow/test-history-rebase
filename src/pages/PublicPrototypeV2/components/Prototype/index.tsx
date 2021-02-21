import React from 'react';

import * as PrototypeDuck from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useCache, useCanASR, useDidUpdateEffect, useSpeechRecognition, useTeardown } from '@/hooks';
import { UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import ASRSpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar/components/ASRSpeechBar';
import { usePrototype, useResetPrototype, useStartPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import ChatDialog from '@/pages/PublicPrototypeV2/components/ChatDialog';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';

import Footer from '../Footer';
import Layout from '../Layout';
import SplashScreen from '../SplashScreen';
import Visuals from '../Visuals';

type PrototypeProps = {
  settings: PrototypeDuck.PrototypeSettings;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({ name, locale, status, isMuted, settings, autoplay, updatePrototype }) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();
  const [canUseASR] = useCanASR();

  const [input, setInput] = React.useState<string>('');

  const isVisuals = settings.layout === PrototypeDuck.PrototypeLayout.VOICE_VISUALS;

  const { status: prototypeMachineStatus, messages, interactions, onInteraction, onPlay } = usePrototype({
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

  const cache = useCache({ input });

  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const isIdle = status === PrototypeDuck.PrototypeStatus.IDLE;
  const isFinished = status === PrototypeDuck.PrototypeStatus.ENDED;

  const sendInteraction = (customInput?: string) => {
    onInteraction(customInput || cache.current.input);
    setInput('');
  };

  const resetState = () => {
    resetPrototype();
    setInput('');
  };

  const onMute = () => updatePrototype({ muted: !isMuted });

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

  return (
    <Layout
      layout={settings.layout}
      isVisuals={isVisuals}
      isListening={isListening}
      renderSplashScreen={({ isMobile }) => (
        <SplashScreen
          logoURL={settings.branchImage}
          onStart={startPrototype}
          colorScheme={settings.brandColor}
          isMobile={isMobile}
          isVisuals={isVisuals}
          projectName={name}
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
            />
          )}
        </Footer>
      )}
    >
      {({ isMobile, isFullScreen }) =>
        isVisuals ? (
          <Visuals isMobile={isMobile} isFullScreen={isFullScreen} onStopListening={onStopListening} onStartListening={onStartListening} />
        ) : (
          <ChatDialog
            onTranscript={onInteraction}
            locale={locale}
            input={input}
            color={settings.brandColor}
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
  name: Skill.activeNameSelector,
  status: PrototypeDuck.prototypeStatusSelector,
  isMuted: PrototypeDuck.prototypeMutedSelector,
  locales: Skill.activeLocalesSelector,
  autoplay: PrototypeDuck.prototypeAutoplaySelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
