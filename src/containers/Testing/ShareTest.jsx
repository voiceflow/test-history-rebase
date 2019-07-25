import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import styled from 'styled-components';

import Button from '@/components/Button';
import RoundButton from '@/components/Button/RoundButton';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import Popover from '@/components/Popover';
import { Spinner } from '@/components/Spinner';
import { setConfirm } from '@/ducks/modal';
import { getMembers, updateMembers } from '@/ducks/team';
import { shareTest } from '@/ducks/test';
import ShareIcon from '@/svgs/link.svg';

import TeamSettings from '../Dashboard/TeamSettings';

const BodyContainer = styled.div`
  padding: ${(props) => (props.index === 1 ? '11px 30px 21px 30px' : '11px 30px 11px 30px')};
  font-family: 'Open Sans';
`;

const TestingHeader = (props) => {
  const { shareTest, rendered, render, team, user, team_id, getMembers } = props;

  const [share, setShare] = useState(false);
  const [link, setLink] = useState(false);
  const [team_setting, setTeamSetting] = useState(null);
  const sharingButton = useRef(null);

  const updateTeam = () => {
    if (team_id) {
      getMembers(team_id)
        .then(() => {
          if (['LOCKED', 'WARNING'].includes(team.state)) {
            setTeamSetting('BILLING');
          } else {
            setTeamSetting(false);
          }
        })
        .catch(() => {
          throw new Error("Can't Retrieve Members");
        });
    }
  };

  useEffect(() => {
    updateTeam();
  }, [team_id]);

  const makeConfig = async () => {
    setShare(!share);
    if (!share) {
      setLink(`${window.location.origin}/demo/${await shareTest(render)}`);
    }
  };

  const renderBody = () => {
    if (rendered && link && team && user) {
      return (
        <>
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
        </>
      );
    }
    return <Spinner isEmpty isMd />;
  };

  return (
    <div ref={sharingButton}>
      <Tooltip title="Share Test" position="bottom">
        <RoundButton id="icon-share" active={share} variant="color" color="#5b9dfa" icon={ShareIcon} onClick={makeConfig} imgSize={16} />
      </Tooltip>
      <Popover gap={-12} show={share} className="mt-3 share" target={sharingButton.current} onHide={() => setShare(!share)} renderBody={renderBody} />
      <TeamSettings hideIcon={true} open={team_setting} update={(setting) => setTeamSetting(setting)} close={() => setTeamSetting(false)} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  rendered: state.test.rendered,
  user: state.account,
  team: state.team.byId[state.team.team_id],
});

const mapDispatchToProps = {
  shareTest,
  updateMembers,
  setConfirm,
  getMembers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingHeader);
