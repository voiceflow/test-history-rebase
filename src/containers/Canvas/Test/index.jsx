import './TestSidebar.css';

import cn from 'classnames';
import { setError } from 'ducks/modal';
import { TEST_STATUS, leaveTest, renderTest, resetTest } from 'ducks/test';
import { useToggle } from 'hooks/toggle';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { compose } from 'recompose';

import TestSettings from './TestSettings';
import Timeline from './timeline';

function Test(props) {
  const { open, status, preview, renderTest, leaveTest, setSaveCB, save, skill, rendered, resetTest, enterFlow, diagramEngine, loading } = props;

  const diagramId = skill.diagram;
  const active = status !== TEST_STATUS.IDLE;
  const [conditionsOpen, toggleConditionsOpen] = useToggle(false);

  const render = () => {
    if (!rendered) {
      if (preview) {
        renderTest(diagramId);
      } else {
        setSaveCB(renderTest);
        save();
      }
    }
  };

  useEffect(() => {
    if (open && !loading) render();
    if (open)
      return () => {
        toggleConditionsOpen(false);
        leaveTest();
      };
  }, [open]);

  useEffect(() => {
    if (!loading && open) render();
  }, [loading]);

  return (
    <>
      {open && <TestSettings open={conditionsOpen} />}
      <div id="TestSidebar" className={cn({ open })}>
        <div className={cn('sidebar_container variables_container', { open: conditionsOpen })}>
          <div className="condition-label" onClick={toggleConditionsOpen}>
            <label>Settings</label>
            <i
              className={cn('fas fa-caret-up fa-lg light-grey rotate', {
                'fa-rotate--90': conditionsOpen,
              })}
            />
          </div>
        </div>
        <div className="no-space__break" />
        <div className={cn('sidebar_container dialog_container')}>
          <div className="condition-label">
            <label>Dialog</label>
            <div onClick={resetTest} className={cn('d-flex align-items-center', { disabled: !active })}>
              <Tooltip title="Restart Test" position="bottom">
                <img src="/restart.svg" alt="restart" width="15" height="15" />
              </Tooltip>
            </div>
          </div>
          <Timeline diagramEngine={diagramEngine} enterFlow={enterFlow} open={open} toggleConditions={toggleConditionsOpen} />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  diagram_id: state.skills.skill.diagram,
  status: state.test.status,
  rendered: state.test.rendered,
});

const mapDispatchToProps = {
  setError,
  resetTest,
  renderTest,
  leaveTest,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
