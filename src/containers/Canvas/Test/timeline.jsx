import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import TestBox from './TestBox';
import { getUserTestOutputs } from './utils';
import { incrementTime, resetTest, fetchState, endTest, updateState, TEST_STATUS } from 'ducks/test';
import { setError } from 'ducks/modal';

const currentTime = () => moment().format('h:mm:ss A');

function Timeline(props) {
  const { endTest, fetchState, updateState, setError, test, diagramEngine, enterFlow } = props;

  const [outputs, setOutputs] = useState([]);
  const [inputs, setInputs] = useState([]);

  const resetTest = () => {
    endTest();
  };

  useEffect(() => {
    switch (test.state) {
      case TEST_STATUS.IDLE:
        setOutputs([]);
        setInputs([]);
      default:
        return;
    }
  }, [test.state]);

  const nextState = async (input) => {
    const newState = await fetchState(input);
    if (!newState) {
      setError('Unable to fetch response');
      return;
    }

    const { trace, line_id, output } = newState;

    // update the state if there is another line to continue
    if (line_id) updateState(newState);
    if (!trace) return;

    if (output && output.length > 0) {
      const userTestOutputs = await getUserTestOutputs(newState, trace);
      setOutputs(outputs.concat(userTestOutputs));
    }
  };

  const inputSubmit = (input) => {
    nextState(input);
    setInputs([
      ...inputs,
      {
        self: input,
        time: currentTime(),
      },
    ]);
  };

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
    <div id="Timeline" className="mb-3">
      <TestBox
        inputs={inputs}
        diagramEngine={diagramEngine}
        enterFlow={enterFlow}
        ended={test.status === TEST_STATUS.ended}
        handleRestart={resetTest}
        inputSubmit={inputSubmit}
        outputs={outputs}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
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
