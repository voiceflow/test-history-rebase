import axios from 'axios';
import Button from 'components/Button';
import ClipBoard from 'components/ClipBoard/ClipBoard';
import Header from 'components/Header';
import SecondaryNavBar from 'components/NavBar/SecondaryNavBar';
import { leaveTest } from 'ducks/test';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Input, InputGroup, InputGroupAddon, Popover, PopoverBody } from 'reactstrap';

import TestTimer from './TestTimer';

const UserTestHeader = (props) => {
  const { page, skill, history, leaveTest, preview, globals } = props;

  const [share, setShare] = useState(false);
  const [link, setLink] = useState({ url: 'Loading...', globals: null });

  const makeConfig = async () => {
    setShare(!share);
    if (link.globals === globals || share === true) return;
    const result = await axios.post(`/test/makeInfo/${skill.project_id}`, { diagram: skill.diagram, globals });
    setLink({ url: `https://creator.voiceflow.com/demo/${result.data}`, globals });
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
          <div className="align-icon title-group px-3 mx-0">
            <Tooltip className="top-nav-icon" title="Share" position="bottom" distance={16}>
              <Button isNavBordered id="icon-share" className="fas fa-share" onClick={makeConfig} />
            </Tooltip>
            <Popover placement="bottom" isOpen={share} target="icon-share" toggle={makeConfig} className="mt-3">
              <PopoverBody style={{ minWidth: '260px' }}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <ClipBoard component="button" className="btn btn-clear copy-link" value={link.url} id="shareLink">
                      <i className="fas fa-copy" />
                    </ClipBoard>
                  </InputGroupAddon>
                  <Input readOnly value={link.url} className="form-control-border right" />
                </InputGroup>
              </PopoverBody>
            </Popover>
          </div>
          <div className="align-icon title-group no-select">
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
        </>
      )}
      subHeaderRenderer={() => !preview && <SecondaryNavBar page={page} history={history} />}
    />
  );
};

const mapStateToProps = (state) => ({
  skill: state.skills.skill,
  globals: state.test.state.globals[0],
});

const mapDispatchToProps = {
  leaveTest,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserTestHeader);
