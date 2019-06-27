import './TestSidebar.css';
import './TestModal.css';

import cn from 'classnames';
import { setError } from 'ducks/modal';
import update from 'immutability-helper';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';
import { compose } from 'recompose';

import { useToggle } from 'hooks/toggle';

import Conditions from './conditions';
import Timeline from './timeline';

function Test(props) {
  const { variables, open, testing_info, diagramEngine, time, stop, enterFlow, resume, history, setTime, resetTest } = props;

  const [reset, toggleReset] = useToggle(false);
  const [conditionsOpen, toggleConditionsOpen] = useToggle(true);

  const [variableMapping, setVariableMapping] = useState(
    variables.reduce((key, val) => {
      key[val] = val;
      return key;
    }, {})
  );

  const handleVariableChange = (variable, value) => {
    setVariableMapping(update(variableMapping, { [variable]: { $set: value } }));
  };

  return (
    <div id="TestSidebar" className={cn({ open })}>
      <div className={cn('sidebar_container variables_container')}>
        <div className="condition-label" onClick={toggleConditionsOpen}>
          <label>Variables</label>
          <i
            className={cn('fas fa-caret-down fa-lg light-grey rotate', {
              'fa-rotate--90': !conditionsOpen,
            })}
          />
        </div>
        <Collapse isOpen={!testing_info && conditionsOpen}>
          <Conditions testing_info={testing_info} handleVariableChange={handleVariableChange} variableMapping={variableMapping} />
        </Collapse>
      </div>
      <div className="no-space__break" />
      <div className={cn('sidebar_container dialog_container')}>
        <div className="condition-label">
          <label>Dialog</label>
          <div onClick={toggleReset} className="d-flex align-items-center">
            <Tooltip title="Restart Test" position="bottom">
              <img src="/restart.svg" alt="restart" width="15" height="15" />
            </Tooltip>
          </div>
        </div>
        <Timeline
          testing_info={testing_info}
          reset={reset}
          setReset={toggleReset}
          diagramEngine={diagramEngine}
          time={time}
          enterFlow={enterFlow}
          stop={stop}
          resume={resume}
          history={history}
          setTime={setTime}
          resetTest={resetTest}
          variableMapping={variableMapping}
          open={open}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
  variables: state.variables.localVariables.concat(state.skills.skill.global),
});

const mapDispatchToProps = {
  setError,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
