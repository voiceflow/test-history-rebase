import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Button from '@/components/Button';
import { setError } from '@/ducks/modal';
import { TEST_STATUS, endTest, fetchState, incrementTime, resetTest, startTest, updateState } from '@/ducks/test';

import TestBox from './TestingBox';
import { getUserTestOutputs } from './utils';

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

  reset = (state = true) => {
    this.endCurrentAudio();
    if (this.interval && this.interval.timeout) clearTimeout(this.interval.timeout);

    if (this.node) {
      this.node.setSelected(false);
      this.node.setFocused(false);
    }
    this.cacheOutputs = null;

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
    const { diagramEngine } = this.props;
    if (!node || !diagramEngine) return;
    const model = diagramEngine.getDiagramModel();
    const nodeModel = model.getNode(node);

    if (nodeModel) {
      if (this.node) {
        this.node.setSelected(false);
        this.node.setFocused(false);
      }
      this.node = nodeModel;
      this.node.setSelected(true);
      this.node.setFocused(true);
      model.setZoomLevel(80);
      const xOffset = window.innerWidth / 2 - 320;
      const yOffset = window.innerHeight / 2 - 150;
      model.setOffset(xOffset - nodeModel.x * 0.8, yOffset - nodeModel.y * 0.8, true, diagramEngine);
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
    const { test, endTest, diagrams } = this.props;
    if (!_.get(this.interval, ['queue', 'length'])) {
      this.setState({ loading: false });
      if (this.interval.end) endTest();
      return;
    }

    clearTimeout(this.interval.timeout);

    const newOutput = this.interval.queue.shift();

    if (newOutput.diagram) {
      if (!_.get(this.interval.queue[0], ['diagram'])) {
        this.setState({ loading: true });
        this.props.enterFlow(newOutput.diagram, false);
        newOutput.delay = 800;
      }

      const diagram = diagrams.find((d) => d.id === newOutput.diagram);
      const diagramName = diagram && diagram.name;

      if (newOutput.type === 'EXIT_FLOW') {
        newOutput.text = (
          <>
            Exiting To Flow <b>{diagramName}</b>
          </>
        );
      } else if (newOutput.type === 'ENTER_FLOW') {
        newOutput.text = (
          <>
            Entering Flow <b>{diagramName}</b>
          </>
        );
      }
    }

    if (!options.dump) {
      this.centerNode(newOutput.node);
      this.playAudio(newOutput.audio);
    }

    if (newOutput.text) {
      newOutput.time = moment
        .unix(0)
        .add(test.startTime && Math.round(Date.now() / 1000 - test.startTime), 'seconds')
        .format('mm:ss');

      const extras = {};
      if (newOutput.audioType) extras.loading = false;

      if (test.debug && !newOutput.delay) {
        newOutput.delay = 500;
      }

      this.addOutput(newOutput, extras);
    }

    if (!options.dump && Array.isArray(newOutput.options)) {
      this.setState({ options: newOutput.options.filter((option) => option && option.trim()) });
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

    const { trace, line_id: lineId } = newState;

    // update the state if there is another line to continue
    if (lineId) this.props.updateState(newState);
    if (!trace) return;

    const outputQueue = await getUserTestOutputs(trace, newState.ending);

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
    const { test, resetTest, startTest, skill } = this.props;
    const { outputs, loading, options } = this.state;

    if (test.status === TEST_STATUS.IDLE) {
      return (
        <div id="TestReset">
          <div>
            <img src="/Testing.svg" alt="user" width="80" />
            <div className="text-muted mb-4 mt-3">Start test to see the dialog transcription</div>
            <Button isPrimary onClick={() => startTest()}>
              Start test
              <i className="fas fa-play ml-2" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div id="Timeline">
        <TestBox
          debug={test.debug}
          ended={test.status === TEST_STATUS.ENDED}
          inputSubmit={this.inputSubmit}
          outputs={outputs}
          loading={loading}
          options={options}
          handleRestart={resetTest}
          playAudio={this.playAudio}
          locale={Array.isArray(skill.locales) && skill.locales[0]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  diagrams: state.diagrams.diagrams,
  skill: state.skills.skill,
  test: state.test,
});

const mapDispatchToProps = {
  endTest,
  incrementTime,
  fetchState,
  resetTest,
  setError,
  startTest,
  updateState,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Timeline);
