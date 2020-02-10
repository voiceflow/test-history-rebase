import React from 'react';
import styled from 'styled-components';

import Button from '@/components/Button';
import ClipBoard from '@/components/ClipBoard/ClipBoard';
import { Spinner } from '@/components/Spinner';
import { MenuContainer } from '@/componentsV2/Menu';
import { FadeDownContainer } from '@/styles/animations';

const ShareMenuContainer = styled(MenuContainer)`
  width: 440px;
  max-width: 440px;
  margin-top: 10px;
`;
const BodyContainer = styled.div`
  padding: 22px 30px 22px 30px;
  font-family: 'Open Sans';
`;

function ShareMenu({ link, user, toggle, handleInviteClick }) {
  return (
    <ShareMenuContainer>
      {link && user ? (
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
                  <Button onClick={() => handleInviteClick(toggle)} isBtn isSecondary>
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          </BodyContainer>
        </FadeDownContainer>
      ) : (
        <Spinner isEmpty isMd />
      )}
    </ShareMenuContainer>
  );
}

export default ShareMenu;
