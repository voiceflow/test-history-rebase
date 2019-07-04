import Button from 'components/Button';
import Header from 'components/Header';
import SecondaryNavBar from 'components/NavBar/SecondaryNavBar';
import { leaveTest } from 'ducks/test';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const UserTestHeader = (props) => {
  const { time, page, skill, history, leaveTest, preview } = props;

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
          <label>{moment.utc(time * 1000).format('mm:ss')}</label>
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
            Back To Canvas
          </Button>
        </div>
      )}
      subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
    />
  );
};

const mapStateToProps = (state) => ({
  time: state.test.time,
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  leaveTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTestHeader);
