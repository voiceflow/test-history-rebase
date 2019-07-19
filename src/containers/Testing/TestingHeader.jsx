import React from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@/components/Button';
import Header from '@/components/Header';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import { leaveTest, TEST_STATUS } from '@/ducks/test';

import ShareTest from './ShareTest';
import TestTimer from './TestingTimer';
import TestingHeaderWrapper from './TestingHeaderWrapper';
import SvgIcon from '@/components/SvgIcon';
import StartTestIcon from '@/svgs/forward.svg';
import LeftIcon from '@/svgs/arrow-left.svg';
import { startTest, resetTest } from '@/ducks/test';

const TestingHeader = (props) => {
  const { page, skill, history, leaveTest, preview, startTest, status, resetTest } = props;
  const active = status !== TEST_STATUS.IDLE;

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
    } else {
      return (
        <div className="testing-back-named">
          <SvgIcon icon={LeftIcon} className="icon-back" onClick={() => history.push('/')} />
          {(skill && skill.name) || 'Loading Skill'}
        </div>
      );
    }
  };

  return (
    <TestingHeaderWrapper>
      <Header
        history={history}
        leftRenderer={() => renderLeftHeader()}
        centerRenderer={() => (
          <div id="middle-group">
            {active === TEST_STATUS.ENDED && <div>Completed •</div>}
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
                {/*<Button*/}
                {/*  isBtn*/}
                {/*  isPrimary*/}
                {/*  className="mr-2"*/}
                {/*  onClick={() => {*/}
                {/*    history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);*/}
                {/*    leaveTest();*/}
                {/*  }}*/}
                {/*  style={{ whiteSpace: 'nowrap' }}*/}
                {/*>*/}
                {/*  Back to Canvas*/}
                {/*</Button>*/}
                <Button
                  variant="contained"
                  className={cn('publish-btn')}
                  onClick={async () => {
                    await resetTest();
                    await startTest();
                  }}
                >
                  Start Test
                  <div className="publish-spinner">
                    <div className="spinner-icon">
                      <SvgIcon icon={StartTestIcon} width={16} height={16} color="#fff" />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </>
        )}
        subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
