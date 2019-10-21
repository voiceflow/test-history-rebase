import './TestingSidebar.css';

import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import { TestingModeContext } from '@/containers/CanvasV2/contexts';
import { saveActiveDiagram } from '@/ducks/diagram';
import { setError } from '@/ducks/modal';
import { TEST_STATUS, renderTest, resetTest, testStatusSelector, userTestSelector } from '@/ducks/test';
import { connect } from '@/hocs';
import { RemoveIntercom } from '@/hocs/removeIntercom';
import { useToggle } from '@/hooks/toggle';

import TestSettings from './components/TestingSettings';
import Timeline from './components/Timeline';

const Testing = ({ status, renderTest, resetTest, userTest, saveActiveDiagram }) => {
  const [settingsOpen, toggleSettingsOpen] = useToggle();
  const isOpen = React.useContext(TestingModeContext);
  const active = status !== TEST_STATUS.IDLE;

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (isOpen) {
      saveActiveDiagram()
        .then(() => renderTest())
        .catch(() => renderTest());

      return () => {
        toggleSettingsOpen(false);
        resetTest();
      };
    }
  }, [isOpen]);

  return (
    <>
      <div id="speech-bar-portal-element"></div>
      {isOpen && (
        <>
          <TestSettings open={settingsOpen} />
          <RemoveIntercom />
        </>
      )}
      <div id="TestSidebar" className={cn({ open: isOpen })}>
        {!userTest && (
          <>
            <div className={cn('sidebar_container variables_container', { open: settingsOpen })}>
              <div className="condition-label pointer" onClick={toggleSettingsOpen}>
                <label className="mb-0">Settings</label>
                <i
                  className={cn('fas fa-caret-up fa-lg light-grey rotate', {
                    'fa-rotate--90': settingsOpen,
                  })}
                />
              </div>
            </div>
            <div className="no-space__break" />
          </>
        )}
        <div className={cn('sidebar_container dialog_container')}>
          <div className="condition-label" id="TestDialog">
            <label className="mb-0">Dialog</label>
            <div className="d-flex">
              <div onClick={resetTest} className={cn('d-flex align-items-center pointer mx-1', { disabled: !active })}>
                <Tooltip title="Reset Test" position="bottom">
                  <SvgIcon icon="restart" />
                </Tooltip>
              </div>
            </div>
          </div>
          {isOpen && <Timeline toggleConditions={toggleSettingsOpen} />}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = {
  status: testStatusSelector,
  userTest: userTestSelector,
};

const mapDispatchToProps = {
  setError,
  resetTest,
  renderTest,
  saveActiveDiagram,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Testing);
