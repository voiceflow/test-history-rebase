import React from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import Header from '@/components/Header';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import SvgIcon from '@/components/SvgIcon';
import NewButton from '@/componentsV2/Button';
import { TEST_STATUS, leaveTest, resetTest, startTest } from '@/ducks/test';
import LeftIcon from '@/svgs/arrow-left.svg';
import StartTestIcon from '@/svgs/forward.svg';

import { updateVersion } from '../../ducks/version';
import ProjectTitle from '../Canvas/components/CanvasHeader/components/ProjectTitle';
import ShareTest from './ShareTest';
import TestingHeaderWrapper from './TestingHeaderWrapper';
import TestTimer from './TestingTimer';

const TestingHeader = (props) => {
  const { page, skill, history, leaveTest, preview, startTest, status, resetTest, updateSkill } = props;
  const active = status !== TEST_STATUS.IDLE;
  const running = status === TEST_STATUS.ACTIVE;

  const renderLeftHeader = () => {
    if (active) {
      return (
        <div
          className="testing-back"
          onClick={() => {
            history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
            leaveTest();
          }}
        >
          <SvgIcon icon={LeftIcon} className="icon-back" />
          Back
        </div>
      );
    }
    return <ProjectTitle onChange={updateSkill} />;
  };

  return (
    <TestingHeaderWrapper>
      <Header
        history={history}
        leftRenderer={() => renderLeftHeader()}
        centerRenderer={() => (
          <div id="middle-group">
            {status === TEST_STATUS.ENDED && (
              <div>
                Completed<span className="separator-dot">•</span>
              </div>
            )}
            <TestTimer />
          </div>
        )}
        rightRenderer={() => (
          <>
            <div className="title-group">
              <div className="title-group-sub">
                <ShareTest />
              </div>
              <div className="align-icon no-select">
                {running ? (
                  <NewButton variant="secondary" onClick={leaveTest}>
                    Finish Test
                  </NewButton>
                ) : (
                  <Button
                    variant="contained"
                    className="start-test-btn"
                    onClick={async () => {
                      await resetTest();
                      await startTest();
                    }}
                  >
                    Start Test
                    <div className="start-sub-btn">
                      <SvgIcon icon={StartTestIcon} width={16} height={16} color="#fff" />
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
        subHeaderRenderer={() => !preview && !active && <SecondaryNavBar page={page} history={history} />}
      />
    </TestingHeaderWrapper>
  );
};

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  status: state.test.status,
});

const mapDispatchToProps = {
  leaveTest,
  startTest,
  resetTest,
  updateSkill: updateVersion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
