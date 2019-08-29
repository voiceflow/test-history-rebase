import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import Button from '@/componentsV2/Button';
import { checkInvName, invNameError } from '@/ducks/publish/alexa';
import { syncInvocationName } from '@/ducks/version';

import { IndefiniteLoading } from '../common/Loading';
import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const InvalidInvName = (props) => {
  const { checkInvName, inv_name, syncInvocationName, locales = [] } = props;

  const [name, setName] = useState(inv_name);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(invNameError(name, locales));

  const updateName = (e) => {
    const name = e.target.value;
    setName(name);
    setError(invNameError(name, locales));
  };

  const submitNewName = async () => {
    if (error) return;
    setLoading(true);
    try {
      // save the name to backend and redux
      await syncInvocationName(name);
      // check status again
      checkInvName();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <IndefiniteLoading message="Updating Invocation Name" />;

  return (
    <UploadPromptWrapper>
      <div className="d-flex text-muted align-items-center">
        <label className="mr-1">Invocation Name</label>
        <Tooltip
          html={
            <>
              Alexa listens for the Invocation Name
              <br /> to launch your Skill
              <br /> e.g.{' '}
              <i>
                Alexa, open <b>Invocation Name</b>
              </i>
            </>
          }
          position="bottom"
        >
          <i className="fal fa-question-circle" />
        </Tooltip>
      </div>
      <input className="form-control" value={name} placeholder="Invocation Name" onChange={updateName} />
      <PopUpText align="left">
        <small>{error}</small>
      </PopUpText>
      <PopupButtonSection>
        <Button variant="primary" onClick={submitNewName} disabled={!!error}>
          Continue
        </Button>
      </PopupButtonSection>
    </UploadPromptWrapper>
  );
};

export default connect(
  (state) => ({
    inv_name: state.skills.skill.inv_name,
    locales: state.skills.skill.locales,
  }),
  { checkInvName, syncInvocationName }
)(InvalidInvName);
