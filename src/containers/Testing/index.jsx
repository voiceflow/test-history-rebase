import './TestingSidebar.css';

import cn from 'classnames';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { compose } from 'recompose';

import SvgIcon from '@/components/SvgIcon';
import { setError } from '@/ducks/modal';
import { TEST_STATUS, renderTest, resetTest } from '@/ducks/test';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { useToggle } from '@/hooks/toggle';

// eslint-disable-next-line no-unused-vars
import ShowDisplay from './ShowDisplay';
import TestSettings from './TestingSettings';
import Timeline from './timeline';

function Test(props) {
  const { open, status, preview, renderTest, resetTest, setSaveCB, save, rendered, enterFlow, diagramEngine, loading, userTest } = props;

  const active = status !== TEST_STATUS.IDLE;
  const [conditionsOpen, toggleConditionsOpen] = useToggle(false);

  const render = () => {
    if (!rendered) {
      if (preview) {
        renderTest();
      } else {
        _.isFunction(setSaveCB) && setSaveCB(renderTest);
        _.isFunction(save) && save();
      }
    }
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (open && !loading) render();
    if (open)
      return () => {
        toggleConditionsOpen(false);
        resetTest();
      };
  }, [open]);

  useEffect(() => {
    if (!loading && open) render();
  }, [loading]);

  return (
    <>
      <div id="speech-bar-portal-element"></div>
      {open && <TestSettings open={conditionsOpen} />}
      {open && <RemoveIntercom />}
      <div id="TestSidebar" className={cn({ open })}>
        {!userTest && (
          <>
            <div className={cn('sidebar_container variables_container', { open: conditionsOpen })}>
              <div className="condition-label pointer" onClick={toggleConditionsOpen}>
                <label>Settings</label>
                <i
                  className={cn('fas fa-caret-up fa-lg light-grey rotate', {
                    'fa-rotate--90': conditionsOpen,
                  })}
                />
              </div>
            </div>
            <div className="no-space__break" />
          </>
        )}
        <div className={cn('sidebar_container dialog_container')}>
          <div className="condition-label" id="TestDialog">
            <label>Dialog</label>
            <div className="d-flex">
              {/* <ShowDisplay /> */}
              <div onClick={resetTest} className={cn('d-flex align-items-center pointer mx-1', { disabled: !active })}>
                <Tooltip title="Reset Test" position="bottom">
                  <SvgIcon icon="restart" />
                </Tooltip>
              </div>
            </div>
          </div>
          <Timeline diagramEngine={diagramEngine} enterFlow={enterFlow || _.noop} open={open} toggleConditions={toggleConditionsOpen} />
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  status: state.test.status,
  rendered: state.test.rendered,
  userTest: state.test.userTest,
});

const mapDispatchToProps = {
  setError,
  resetTest,
  renderTest,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Test);
