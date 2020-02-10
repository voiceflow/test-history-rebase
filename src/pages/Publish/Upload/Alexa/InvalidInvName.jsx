import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';

import Button from '@/components/Button';
import { checkInvName, invNameError } from '@/ducks/publish/alexa';
import { activeLocalesSelector, invNameSelector, updateInvName } from '@/ducks/skill';
import { connect } from '@/hocs';

import { IndefiniteLoading } from '../common/Loading';
import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const InvalidInvName = (props) => {
  const { checkInvName, invName, updateInvName, locales = [] } = props;

  const [name, setName] = useState(invName);
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
      await updateInvName(name);
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
        <label className="mr-1">
          Invocation Name{' '}
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
        </label>
      </div>
      <input className="form-control" value={name} placeholder="Invocation Name" onChange={updateName} />
      <PopUpText>
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
  {
    invName: invNameSelector,
    locales: activeLocalesSelector,
  },
  { checkInvName, updateInvName }
)(InvalidInvName);
