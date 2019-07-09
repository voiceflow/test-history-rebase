import Button from 'components/Button';
import ClipBoard from 'components/ClipBoard/ClipBoard';
import Header from 'components/Header';
import SecondaryNavBar from 'components/NavBar/SecondaryNavBar';
import { leaveTest, shareTest } from 'ducks/test';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody } from 'reactstrap';

import TestTimer from './TestTimer';

const UserTestHeader = (props) => {
  const { page, skill, history, leaveTest, preview, shareTest, rendered } = props;

  const [share, setShare] = useState(false);
  const [link, setLink] = useState('Loading...');

  const makeConfig = async () => {
    setShare(!share);
    if (!share) {
      setLink(`${window.location.origin}/demo/${await shareTest()}`);
    }
  };

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
        <>
          <div className="title-group">
            <div className="title-group-sub">
              <Tooltip title="Share Test" position="bottom">
                <Button className="dropdown-button-border" id="icon-share" type="button" onClick={makeConfig} />
              </Tooltip>
              <Popover placement="bottom" isOpen={share} target="icon-share" toggle={makeConfig} className="mt-3">
                <PopoverBody style={{ minWidth: '260px' }}>
                  {rendered ? (
                    <>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <ClipBoard component="button" className="btn btn-clear copy-link" value={link} id="shareLink">
                            <i className="fas fa-copy" />
                          </ClipBoard>
                        </InputGroupAddon>
                        <Input readOnly value={link} className="form-control-border right" />
                      </InputGroup>
                      <div className="text-center text-dull p-2 mt-1">Share test for anyone on browser</div>
                    </>
                  ) : (
                    <div className="text-center pt-2 pb-1">
                      <div className="loader text-md" />
                    </div>
                  )}
                </PopoverBody>
              </Popover>
            </div>
            <div className="align-icon no-select">
              <Button
                isBtn
                isPrimary
                className="mr-2"
                onClick={() => {
                  history.push(`/canvas/${skill.skill_id}/${skill.diagram}`);
                  leaveTest();
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Back to Canvas
              </Button>
            </div>
          </div>
        </>
      )}
      subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
    />
  );
};

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  rendered: state.test.rendered,
});

const mapDispatchToProps = {
  leaveTest,
  shareTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTestHeader);
