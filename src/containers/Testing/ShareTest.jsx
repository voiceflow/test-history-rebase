import React, { useRef, useState } from 'react';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import Button from '@/components/Button';
import RoundButton from '@/components/Button/RoundButton';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Popover from '@/components/Popover';
import { Spinner } from '@/components/Spinner';
import { userSelector } from '@/ducks/account';
import { setConfirm } from '@/ducks/modal';
import { renderTest, shareTest } from '@/ducks/test';
import { connect } from '@/hocs';
import { FadeDownContainer } from '@/styles/animations';

import TeamSettings from '../Dashboard/TeamSettings';

const BodyContainer = styled.div`
  padding: 22px 30px 22px 30px;
  font-family: 'Open Sans';
`;

const TestingHeader = (props) => {
  const { shareTest, renderTest, render, user } = props;

  const [share, setShare] = useState(false);
  const [link, setLink] = useState(false);
  const [teamSetting, setTeamSetting] = useState(null);
  const sharingButton = useRef(null);

  const makeConfig = async () => {
    setShare(!share);
    if (!share) {
      setLink(false);
      if (render) await renderTest();
      setLink(`${window.location.origin}/demo/${await shareTest()}`);
    }
  };

  const renderBody = () => {
    if (link && user) {
      return (
        <FadeDownContainer>
          <BodyContainer index={1}>
            <div className="mb-3">
              <label className="text-muted">Share testable link</label>
              <small className="text-dull">
                Anyone with this link will be able to simulate this flow from within their browser by using their voice or text input.
              </small>
            </div>
            <ClipBoard name="link" value={link} id="shareLink" />
          </BodyContainer>
          <div className="no-space__break" />
          <BodyContainer index={2}>
            <div className="mb-3">
              <div className="d-flex">
                <div className="flex-fill d-flex flex-column">
                  <label className="text-muted">Invite collaborators</label>
                  <small className="text-dull mr-2">Collaborators can edit this projects contents</small>
                </div>
                <div className="d-flex align-items-end">
                  <Button isBtn isSecondary onClick={() => setTeamSetting('MEMBERS')}>
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          </BodyContainer>
        </FadeDownContainer>
      );
    }
    return <Spinner isEmpty isMd />;
  };

  return (
    <div ref={sharingButton}>
      <Tooltip title="Share Test" position="bottom">
        <RoundButton active={share} variant="color" color="#5b9dfa" icon="share" onClick={makeConfig} imgSize={16} />
      </Tooltip>
      <Popover gap={-10} show={share} className="mt-3 share" target={sharingButton.current} onHide={() => setShare(!share)} renderBody={renderBody} />
      <TeamSettings hideIcon={true} open={teamSetting} update={(setting) => setTeamSetting(setting)} close={() => setTeamSetting(false)} />
    </div>
  );
};

const mapStateToProps = {
  user: userSelector,
};

const mapDispatchToProps = {
  shareTest,
  renderTest,
  setConfirm,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
