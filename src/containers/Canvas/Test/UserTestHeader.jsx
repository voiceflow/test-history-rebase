import Button from 'components/Button';
import Header from 'components/Header';
import SecondaryNavBar from 'components/NavBar/SecondaryNavBar';
import { leaveTest } from 'ducks/test';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import TestTimer from './TestTimer';

const UserTestHeader = (props) => {
  const { page, skill, history, leaveTest, preview } = props;

  return (
    <Header
      history={history}
      leftRenderer={() => (
        <div>
          <Link to="/" className="mx-3">
            <img src="/back.svg" alt="back" className="mr-3" />
          </Link>
          {(skill && skill.name) || 'Loading Skill'}
        </div>
      )}
      centerRenderer={() => (
        <div id="middle-group">
          <TestTimer />
        </div>
      )}
      rightRenderer={() => (
        <div>
          <Button
            isBtn
            isSecondary
            className="mr-2"
            onClick={() => {
              history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
              leaveTest();
            }}
          >
            Back to Canvas
          </Button>
        </div>
      )}
      subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
    />
  );
};

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  leaveTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTestHeader);
