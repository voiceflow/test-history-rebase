import './TestSidebar.css';
import './TestModal.css';

import cn from 'classnames';
import { setError } from 'ducks/modal';
import { updateVariableMapping, endTest, TEST_STATUS } from 'ducks/test';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';
import { compose } from 'recompose';

import { useToggle } from 'hooks/toggle';

import Conditions from './conditions';
import Timeline from './timeline';

function Test(props) {
  const { open, status, endTest, enterFlow, diagramEngine, variableMapping, updateVariableMapping } = props;

  const active = status !== TEST_STATUS.IDLE;

  const [conditionsOpen, toggleConditionsOpen] = useToggle(true);

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
        <Collapse isOpen={!active && conditionsOpen}>
          <Conditions handleVariableChange={updateVariableMapping} variableMapping={variableMapping} />
        </Collapse>
      </div>
      <div className="no-space__break" />
      <div className={cn('sidebar_container dialog_container')}>
        <div className="condition-label">
          <label>Dialog</label>
          <div onClick={endTest} className="d-flex align-items-center">
            <Tooltip title="Restart Test" position="bottom">
              <img src="/restart.svg" alt="restart" width="15" height="15" />
            </Tooltip>
          </div>
        </div>
        <Timeline diagramEngine={diagramEngine} enterFlow={enterFlow} variableMapping={variableMapping} open={open} />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
  variableMapping: state.test.variableMapping,
  status: state.test.status,
});

const mapDispatchToProps = {
  setError,
  endTest,
  updateVariableMapping,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
