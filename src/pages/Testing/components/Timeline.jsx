import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';

import Button from '@/componentsV2/Button';
import { withEventualEngine } from '@/contexts/EventualEngineContext';
import { allDiagramsSelector } from '@/ducks/diagram';
import { setError } from '@/ducks/modal';
import { recentTestingSelector } from '@/ducks/recent';
import { activeLocalesSelector, updateDiagramID } from '@/ducks/skill';
import { TEST_STATUS, endTest, fetchState, resetTest, startTest, testSelector, userTestSelector } from '@/ducks/test';
import { connect } from '@/hocs';
import { TestAction } from '@/pages/Testing/constants';
import { getUserTestOutputs } from '@/pages/Testing/utils';
import { compose } from '@/utils/functional';

import TestBox from './TestingBox';

class Timeline extends Component {
  state = {
    outputs: [],
    inputs: [],
    loading: false,
    options: null,
  };

  node = null;

  audio = null;

  interval = null;

  cacheOutputs = null;

  streamAudio = null;

  reset = (state = true) => {
    const { eventualEngine } = this.props;
    this.endCurrentAudio();
    if (this.interval && this.interval.timeout) clearTimeout(this.interval.timeout);

    const engine = eventualEngine.get();
    if (engine) {
      engine.clearActivation();
    }

    this.cacheOutputs = null;
    this.streamAudio = null;

    if (!state) return;

    this.setState({
      outputs: [],
      inputs: [],
    });
  };

  componentWillUnmount = () => this.reset(false);

  componentDidUpdate = (prevProps) => {
    if (prevProps.test.status !== this.props.test.status) {
      switch (this.props.test.status) {
        case TEST_STATUS.IDLE:
          this.reset();
          break;
        case TEST_STATUS.ACTIVE:
          this.nextState();
          break;
        default:
      }
    }
  };

  centerNode = (node) => {
    const { eventualEngine } = this.props;

    const engine = eventualEngine.get();
    if (node && engine) {
      this.node = node;
      engine.node.center(node);
      engine.selection.replace([node]);
    }
  };

  addOutput = (newOutput, extra) => {
    if (!newOutput) return;
    this.cacheOutputs = [...(this.cacheOutputs || this.state.outputs), newOutput];
    this.setState({
      outputs: this.cacheOutputs,
      ...extra,
    });
  };

  endCurrentAudio = () => {
    if (this.audio) this.audio.pause();
    this.audio = null;
  };

  playAudio = (audio) => {
    if (!audio) return;
    this.endCurrentAudio();
    this.audio = audio;
    this.audio.play();
  };

  popInterval = (options = {}) => {
    const { settings, test, endTest, diagrams } = this.props;

    if (!_.get(this.interval, ['queue', 'length'])) {
      this.setState({ loading: false });
      if (this.interval.end) endTest();
      return;
    }

    clearTimeout(this.interval.timeout);

    const newOutput = this.interval.queue.shift();

    if (newOutput.forceInput && !options.dump) {
      this.nextState(newOutput.forceInput);
      return;
    }

    if (newOutput.diagram) {
      if (!_.get(this.interval.queue[0], ['diagram'])) {
        this.setState({ loading: true });
        this.props.enterFlow(newOutput.diagram);
        newOutput.delay = 800;
      }

      const diagram = diagrams.find(({ id }) => id === newOutput.diagram);
      const diagramName = diagram && diagram.name;

      if (newOutput.type === TestAction.EXIT_FLOW) {
        newOutput.text = (
          <>
            Exiting To Flow <b>{diagramName}</b>
          </>
        );
      } else if (newOutput.type === TestAction.ENTER_FLOW) {
        newOutput.text = (
          <>
            Entering Flow <b>{diagramName}</b>
          </>
        );
      }
    }

    if (!options.dump) {
      this.centerNode(newOutput.node);

      if (newOutput.type === 'Stream' && test.state.play) {
        newOutput.delay = false;
        let play = 'Pause';
        if (test.state.play.action === 'START' && this.interval.queue.length === 0) {
          this.streamAudio = newOutput.audio;
          this.streamAudio.onended = () => this.nextState('Next');
          this.playAudio(this.streamAudio);
        } else {
          newOutput.text = null;
          if (this.streamAudio) {
            // eslint-disable-next-line max-depth
            if (test.state.play.action === 'PAUSE') {
              this.streamAudio.pause();
              play = 'Resume';
            } else if (test.state.play.action === 'RESUME') {
              this.playAudio(this.streamAudio);
            } else if (test.state.play.action === 'END') {
              this.streamAudio.onended = _.noop;
              this.streamAudio = null;
            }
          }
        }
        if (test.state.play.action !== 'END') this.setState({ options: ['Previous', play, 'Next'] });
      } else {
        this.playAudio(newOutput.audio);
        if (Array.isArray(newOutput.options)) this.setState({ options: newOutput.options.filter((option) => option && option.trim()) });
      }
    }

    if (newOutput.text) {
      newOutput.time = moment
        .unix(0)
        .add(test.startTime && Math.round(Date.now() / 1000 - test.startTime), 'seconds')
        .format('mm:ss');

      const extras = {};
      if (newOutput.audioType) extras.loading = false;

      if (settings.debug && !newOutput.delay) {
        newOutput.delay = 500;
      }

      this.addOutput(newOutput, extras);
    }

    if (newOutput.delay && !options.dump) {
      this.interval.timeout = setTimeout(() => this.popInterval(options), newOutput.delay);
    } else {
      this.popInterval(options);
    }
  };

  emptyInterval = () => {
    if (this.interval) {
      // Add everything remaining in the queue to the output without playing them
      this.endCurrentAudio();
      this.popInterval({ dump: true });
      clearTimeout(this.interval.timeout);
      this.interval = null;
    }
  };

  nextState = async (input) => {
    this.setState({ loading: true, options: null });
    const newState = await this.props.fetchState(input);
    if (!newState) {
      this.setState({ loading: false });
      this.props.setError('Unable to fetch response');
      return;
    }

    const { trace, ending } = newState;
    if (!trace) return;

    const outputQueue = await getUserTestOutputs(trace, ending, newState);

    this.interval = {
      queue: outputQueue,
      end: newState.end,
    };

    this.popInterval();
  };

  inputSubmit = (input) => {
    if (this.state.loading) return;

    const newInput = {
      self: input,
    };

    this.emptyInterval();
    this.addOutput(newInput);
    this.nextState(input);
  };

  render() {
    const { settings, test, resetTest, startTest, locales = [] } = this.props;
    const { outputs, loading, options } = this.state;

    if (test.status === TEST_STATUS.IDLE) {
      return (
        <div id="TestReset">
          <div>
            <img src="/Testing.svg" alt="user" width="80" />
            <div className="text-muted mb-4 mt-3">Start test to see the dialog transcription</div>
            <Button icon="forward" onClick={() => startTest()} className="d-inline-flex">
              Start Test
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div id="Timeline">
        <TestBox
          debug={settings.debug}
          ended={test.status === TEST_STATUS.ENDED}
          inputSubmit={this.inputSubmit}
          outputs={outputs}
          loading={loading}
          options={options}
          handleRestart={resetTest}
          playAudio={this.playAudio}
          locale={locales[0]}
        />
      </div>
    );
  }
}

const mapStateToProps = {
  diagrams: allDiagramsSelector,
  locales: activeLocalesSelector,
  test: testSelector,
  userTest: userTestSelector,
  settings: recentTestingSelector,
};

const mapDispatchToProps = {
  endTest,
  fetchState,
  resetTest,
  setError,
  startTest,
  enterFlow: updateDiagramID,
};

export default compose(
  withEventualEngine,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Timeline);
