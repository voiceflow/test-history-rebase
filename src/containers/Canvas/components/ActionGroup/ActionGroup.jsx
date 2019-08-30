import './ActionGroup.css';

import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Modal } from 'reactstrap';

import RoundButton from '@/components/Button/RoundButton';
import { ModalHeader } from '@/components/Modals/ModalHeader';
import Settings from '@/containers/Settings';
import ShareTest from '@/containers/Testing/ShareTest';
import { setError, showSettingsModal } from '@/ducks/modal';

import Alexa from './Alexa';
import Google from './Google';
import { SubTitleGroup } from './styled';

function SettingsModal({ isOpen, onToggle, children }) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} className="ag__settings_modal">
      <div className="ag__settings_header">
        <ModalHeader toggle={onToggle} className="pb-2" header="Project Settings" />
      </div>
      {children}
    </Modal>
  );
}

function ActionGroup(props) {
  const { platform, showSettingsModal, showSettings, unfocus } = props;

  const renderPlatform = () => {
    if (platform === 'alexa') return <Alexa />;
    return <Google />;
  };

  return (
    <>
      <SettingsModal isOpen={showSettings.show} onToggle={() => showSettingsModal(false)}>
        <Settings {...props} tag={showSettings.tag} />
      </SettingsModal>
      <SubTitleGroup>
        <Tooltip title="Settings" position="bottom">
          <RoundButton
            active={showSettings.show}
            icon="cog"
            onClick={() => {
              unfocus();
              showSettingsModal(true);
            }}
            imgSize={15}
          />
        </Tooltip>
      </SubTitleGroup>
      <SubTitleGroup>
        <ShareTest render />
      </SubTitleGroup>

      {renderPlatform()}
    </>
  );
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
  showSettings: state.modal.showSettings,
});

const mapDispatchToProps = {
  setError,
  showSettingsModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionGroup);
