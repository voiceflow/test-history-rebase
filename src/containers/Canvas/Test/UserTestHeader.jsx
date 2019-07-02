import Button from 'components/Button';
import Header from 'components/Header';
import SecondaryNavBar from 'components/NavBar/SecondaryNavBar';
import { TEST_STATUS, leaveTest, startTest } from 'ducks/test';
import moment from 'moment';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const UserTestHeader = (props) => {
  const { time, page, status, skill, history, startTest, leaveTest, preview } = props;

  const diagramId = skill.diagram;

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
          {status !== TEST_STATUS.IDLE ? (
            <Button
              isBtn
              isSecondary
              className="mr-2"
              onClick={() => {
                history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
                leaveTest();
              }}
            >
              Finish Test
            </Button>
          ) : (
            <ReactCSSTransitionGroup transitionName="test_button" transitionEnterTimeout={0} transitionLeaveTimeout={500}>
              <Button isPrimary className="mr-2" onClick={() => startTest(diagramId)}>
                Start test
                <i className="fas fa-play ml-2" />
              </Button>
            </ReactCSSTransitionGroup>
          )}
        </div>
      )}
      subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
    />
  );
};

const mapStateToProps = (state) => ({
  time: state.test.time,
  rendered: state.test.rendered,
  status: state.test.status,
  skill: state.skills.skill,
});

const mapDispatchToProps = {
  startTest,
  leaveTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTestHeader);
