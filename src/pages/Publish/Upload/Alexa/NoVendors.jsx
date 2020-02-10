import React from 'react';
import { connect } from 'react-redux';

import Button from '@/components/Button';
import { resetAlexaUpload } from '@/ducks/publish/alexa';

import { PopUpLink, PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

// Developer Account Needed
const NoVendors = ({ resetAlexaUpload }) => (
  <UploadPromptWrapper>
    <img src="/Support.svg" alt="" />
    <PopUpText>Looks like you don't have a developer account, create one to get started!</PopUpText>
    <PopupButtonSection>
      <PopUpLink href="https://developer.amazon.com/login.html" target="_blank" rel="noopener noreferrer" onClick={resetAlexaUpload}>
        <Button variant="primary">Developer Sign Up</Button>
      </PopUpLink>
    </PopupButtonSection>
  </UploadPromptWrapper>
);

export default connect(
  null,
  { resetAlexaUpload }
)(NoVendors);
