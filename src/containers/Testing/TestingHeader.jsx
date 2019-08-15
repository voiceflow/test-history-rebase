import React from 'react';
import { connect } from 'react-redux';

import Header from '@/components/Header';
import SecondaryNavBar from '@/components/NavBar/SecondaryNavBar';
import SvgIcon from '@/components/SvgIcon';
import NewButton from '@/componentsV2/Button';
import { TEST_STATUS, resetTest, startTest } from '@/ducks/test';
import { updateVersion } from '@/ducks/version';

import { SubTitleGroup } from '../Canvas/components/ActionGroup/styled';
import ProjectTitle from '../Canvas/components/CanvasHeader/components/ProjectTitle';
import ShareTest from './ShareTest';
import { SeparatorDot, StartButton, StartSubButton, TestingBackButton } from './TestingHeaderWrapper';
import TestTimer from './TestingTimer';

function TestingHeader({ page, skill, history, resetTest, preview, startTest, status, updateSkill }) {
  const active = status !== TEST_STATUS.IDLE;
  const running = status === TEST_STATUS.ACTIVE;

  const onClick = () => {
    history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
    resetTest();
  };

  const renderLeftHeader = () => (active ? <TestingBackButton onClick={onClick}>Back</TestingBackButton> : <ProjectTitle onChange={updateSkill} />);

  return (
    <Header
      history={history}
      onBackClick={onClick}
      leftRenderer={() => renderLeftHeader()}
      centerRenderer={() => (
        <>
          {status === TEST_STATUS.ENDED && (
            <div>
              Completed<SeparatorDot>•</SeparatorDot>
            </div>
          )}
          <TestTimer />
        </>
      )}
      rightRenderer={() => (
        <>
          <SubTitleGroup>
            <ShareTest />
          </SubTitleGroup>
          <div className="align-icon no-select">
            {running ? (
              <NewButton variant="secondary" onClick={resetTest}>
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
                  <SvgIcon icon="forward" width={16} height={16} color="#fff" />
                </StartSubButton>
              </StartButton>
            )}
          </div>
        </>
      )}
      subHeaderRenderer={() => !preview && !active && <SecondaryNavBar page={page} history={history} />}
    />
  );
}

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  status: state.test.status,
});

const mapDispatchToProps = {
  resetTest,
  startTest,
  updateSkill: updateVersion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
