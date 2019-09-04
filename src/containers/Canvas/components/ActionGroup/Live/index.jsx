import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Modal } from 'reactstrap';

import Button from '@/components/Button';
import SvgIcon from '@/components/SvgIcon';
import { IndefiniteLoading } from '@/containers/Publish/Upload/common/Loading';
import { uploadLive } from '@/ducks/version';

import { UploadButtonWrapper } from '../styled';

function Live(props) {
  const { uploadLive } = props;
  const [liveModal, setLiveModal] = useState(false);
  const [liveStage, setLiveStage] = useState(0);

  const openUpdateLive = () => {
    setLiveModal(true);
  };

  const updateLiveVersion = async () => {
    setLiveStage(1);
    try {
      if (window.canvasSave) await window.canvasSave();
      await uploadLive();
      setLiveStage(2);
    } catch (error) {
      console.error(error);
      setLiveStage(0);
    }
  };

  const renderLiveStage = () => {
    switch (liveStage) {
      case 2:
        return (
          <>
            <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live-success.svg" alt="Upload" />
            <div className="modal-bg-txt text-center mt-2"> Live Version Updated</div>
            <div className="modal-txt text-center mt-2 mb-3">This may take a few minutes to be reflected on your device.</div>
          </>
        );
      case 1:
        return <IndefiniteLoading message="Publishing to Live" />;
      default:
        return (
          <>
            <img className="modal-img-small mb-4 mt-3 mx-auto" src="/live.svg" alt="Upload" />
            <div className="modal-bg-txt text-center mt-2"> Confirm Live Update</div>
            <div className="modal-txt text-center mt-2 mb-3">
              This update will affect the live version of your project. Please be sure you wish to do this.
            </div>
            <Button isPrimary onClick={updateLiveVersion}>
              Confirm Update
            </Button>
          </>
        );
    }
  };

  return (
    <UploadButtonWrapper>
      <Modal isOpen={liveModal} onClosed={() => setLiveStage(0)} toggle={() => setLiveModal(false)}>
        <div className="p-4 text-center">{renderLiveStage()}</div>
      </Modal>
      <Tooltip
        html={<div style={{ width: 180 }}>Test your Skill on your own Google device, or in the Google Actions console</div>}
        position="bottom"
        distance={16}
      >
        <Button variant="contained" className="publish-btn" onClick={openUpdateLive}>
          Update Live
          <div className="publish-spinner">
            <div className="spinner-icon">
              <SvgIcon icon="cloudUpload" color="#fff" />
            </div>
          </div>
        </Button>
      </Tooltip>
    </UploadButtonWrapper>
  );
}

export default connect(
  null,
  { uploadLive }
)(Live);
