import React from 'react';

import * as PrototypeDuck from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useDidUpdateEffect, useSpeechRecognition, useTeardown } from '@/hooks';
import { usePrototype, useResetPrototype, useStartPrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';

import Layout from '../Layout';
import Visuals from '../Visuals';

type PrototypeProps = {
  layout: PrototypeDuck.PrototypeLayout;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({ layout, locale, status, autoplay }) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();

  const { status: prototypeMachineStatus, messages, interactions, onInteraction } = usePrototype({
    debug: false,
    isPublic: true,
    prototypeStatus: status,
  });

  const { isListening, onStartListening, onStopListening } = useSpeechRecognition({ locale, onTranscript: onInteraction });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // TODO: use this to dive loading indicator
  const _isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const isSplashScreenPassed = status !== PrototypeDuck.PrototypeStatus.IDLE;

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

  useTeardown(() => {
    resetPrototype();
  }, []);

  useDidUpdateEffect(() => {
    if (autoplay) {
      startPrototype();
    }
  }, [autoplay]);

  // TODO: replace with the splash screen
  const isVisuals = layout === PrototypeDuck.PrototypeLayout.VOICE_VISUALS;

  return (
    <Layout
      isVisuals={isVisuals}
      isListening={isListening}
      renderSplashScreen={() => (
        <div>
          this is a Splash screen, press
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              startPrototype();
            }}
          >
            Start
          </a>{' '}
          to try visuals
        </div>
      )}
      splashScreenPassed={isSplashScreenPassed}
      // TODO: replace with the visuals footer
      renderVisualsFooter={({ toggleFullScreen }) => <div onClick={toggleFullScreen}>Footer</div>}
    >
      {({ isMobile, isFullScreen }) =>
        isVisuals ? (
          <Visuals
            isMobile={isMobile}
            onMouseUp={() => (isMobile || isFullScreen) && onStopListening()}
            onMouseDown={() => (isMobile || isFullScreen) && onStartListening()}
            isFullScreen={isFullScreen}
          />
        ) : (
          <div>children</div>
        )
      }
    </Layout>
  );
};

const mapStateToProps = {
  status: PrototypeDuck.prototypeStatusSelector,
  locales: Skill.activeLocalesSelector,
  autoplay: PrototypeDuck.prototypeAutoplaySelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
