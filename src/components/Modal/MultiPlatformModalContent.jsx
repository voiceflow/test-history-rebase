import './Modals.css';

import React from 'react';

import Button from '@/components/Button';

const MultiPlatformModalContent = ({ toggle, history }) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-center">
        <div className="text-muted text-center my-5 mx-5">
          Building for both platforms simultaneously is a premium feature, please upgrade to proceed
        </div>
      </div>
      <div className="d-flex justify-content-center img-container">
        <img className="platform-modal-img" src="/alexa.png" alt="empty" />
        <img className="platform-modal-img" src="/google_home.png" alt="empty" />
      </div>
      <div
        className="d-flex justify-content-end py-4"
        style={{
          backgroundColor: '#eff2f8',
          borderRadius: '0 0 10px 10px',
          borderTop: '1px solid 1px solid rgba(141, 162, 181, .28)',
        }}
      >
        <Button isFlat className="mr-4" onClick={toggle}>
          Close
        </Button>
        <Button
          isPrimary
          className="mr-4"
          onClick={() => {
            history.push('/account/upgrade');
          }}
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default MultiPlatformModalContent;
