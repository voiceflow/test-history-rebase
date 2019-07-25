import React from 'react';
import { connect } from 'react-redux';

import Header from '@/components/Header';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import SvgIcon from '@/components/SvgIcon';
import NewButton from '@/componentsV2/Button';
import { TEST_STATUS, leaveTest, resetTest, startTest } from '@/ducks/test';
import { updateVersion } from '@/ducks/version';
import LeftIcon from '@/svgs/arrow-left.svg';
import StartTestIcon from '@/svgs/forward.svg';

import ProjectTitle from '../Canvas/components/CanvasHeader/components/ProjectTitle';
import ShareTest from './ShareTest';
import { BackButtonIcon, SeparatorDot, StartButton, StartSubButton, TestingBackButton } from './TestingHeaderWrapper';
import TestTimer from './TestingTimer';

const TestingHeader = (props) => {
  const { page, skill, history, leaveTest, preview, startTest, status, resetTest, updateSkill, team_id } = props;
  const active = status !== TEST_STATUS.IDLE;
  const running = status === TEST_STATUS.ACTIVE;

  const renderLeftHeader = () => {
    if (active) {
      return (
        <TestingBackButton
          onClick={() => {
            history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
            leaveTest();
          }}
        >
          <BackButtonIcon icon={LeftIcon} />
          Back
        </TestingBackButton>
      );
    }
    return <ProjectTitle onChange={updateSkill} />;
  };

  return (
    <Header
      history={history}
      leftRenderer={() => renderLeftHeader()}
      centerRenderer={() => (
        <div id="middle-group">
          {status === TEST_STATUS.ENDED && (
            <div>
              Completed<SeparatorDot>•</SeparatorDot>
            </div>
          )}
          <TestTimer />
        </div>
      )}
      rightRenderer={() => (
        <div className="title-group">
          <div className="title-group-sub">
            <ShareTest team_id={team_id} />
          </div>
          <div className="align-icon no-select">
            {running ? (
              <NewButton variant="secondary" onClick={leaveTest}>
                Finish Test
              </NewButton>
            ) : (
              <StartButton
                variant="contained"
                onClick={async () => {
                  await resetTest();
                  await startTest();
                }}
              >
                Start Test
                <StartSubButton>
                  <SvgIcon icon={StartTestIcon} width={16} height={16} color="#fff" />
                </StartSubButton>
              </StartButton>
            )}
          </div>
        </div>
      )}
      subHeaderRenderer={() => !preview && !active && <SecondaryNavBar page={page} history={history} />}
    />
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
