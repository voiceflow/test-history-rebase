import { setError } from 'ducks/modal';
import { TEST_STATUS, endTest, fetchState, incrementTime, resetTest, updateState } from 'ducks/test';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import TestBox from './TestBox';
import { getUserTestOutputs } from './utils';

const currentTime = () => moment().format('h:mm:ss A');

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

  componentWillUnmount = () => {
    this.endCurrentAudio();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.test.status !== this.props.test.status) {
      switch (this.props.test.status) {
        case TEST_STATUS.IDLE:
          this.endCurrentAudio();
          this.setState({
            outputs: [],
            inputs: [],
          });
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
      nodeModel.setSelected(true);
      nodeModel.setFocused(true);
      model.setZoomLevel(80);
      const xOffset = window.innerWidth / 2 - 320;
      const yOffset = window.innerHeight / 2 - 150;
      model.setOffset(xOffset - nodeModel.x * 0.8, yOffset - nodeModel.y * 0.8, true, diagramEngine);
    }
  };

  addOutputs = (newOutputs = [], extra) => {
    this.setState({
      outputs: [...this.state.outputs, ...newOutputs],
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

  popInterval = (end) => {
    const { test, endTest, diagrams } = this.props;
    if (!_.get(this.interval, ['queue', 'length'])) {
      this.setState({ loading: false });
      if (end) endTest();
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
      } else {
        newOutput.text = (
          <>
            Entering Flow <b>{diagramName}</b>
          </>
        );
      }
    }

    this.centerNode(newOutput.node);
    this.playAudio(newOutput.audio);

    if (newOutput.text) {
      newOutput.time = moment
        .unix(0)
        .add(test.time, 'seconds')
        .format('mm:ss');
      const extras = {};
      if (newOutput.audioType) extras.loading = false;

      if (test.debug && !newOutput.delay) {
        newOutput.delay = 500;
      }
      this.addOutputs([newOutput], extras);
    }

    if (Array.isArray(newOutput.options)) {
      this.setState({ options: newOutput.options });
    }

    if (newOutput.delay) {
      this.interval.timeout = setTimeout(() => this.popInterval(end), newOutput.delay);
    } else {
      this.popInterval(end);
    }
  };

  emptyInterval = () => {
    if (this.interval) {
      // Add everything remaining in the queue to the output without playing them
      this.endCurrentAudio();
      this.addOutputs([this.interval.queue]);
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

    const { trace, line_id } = newState;

    // update the state if there is another line to continue
    if (line_id) this.props.updateState(newState);
    if (!trace) return;

    const outputQueue = await getUserTestOutputs(newState, trace);

    this.emptyInterval();
    this.interval = {
      queue: outputQueue,
    };

    this.popInterval(newState.end);
  };

  inputSubmit = (input) => {
    if (this.state.loading) return;

    const newInput = {
      self: input,
      time: currentTime(),
    };

    this.addOutputs([newInput]);
    this.nextState(input);
  };

  render() {
    const { test, resetTest } = this.props;
    const { outputs, loading, options } = this.state;

    if (test.status === TEST_STATUS.IDLE) {
      return (
        <div className="text-center mb-3">
          <img className="mb-3 mt-5" src="/Testing.svg" alt="user" width="80" />
          <br />
          <span className="text-muted">Start test to see the dialog transcription</span>
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
  updateState,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Timeline);
