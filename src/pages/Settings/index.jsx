import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Modal, { ModalHeader } from '@/components/Modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import { ButtonGroupRouterContainer } from './components';
import { SETTINGS_ROUTES, SettingsRoute } from './constants';

const SettingsModal = ({ open, toggle, type = SettingsRoute.BASIC, setType }) => {
  return (
    <Modal isOpen={open} toggle={toggle}>
      <LockedResourceOverlay type={Realtime.ResourceType.SETTINGS} disabled={!open}>
        {({ forceUpdateKey }) => (
          <>
            <ModalHeader toggle={toggle} header="Project Settings" />
            <ButtonGroupRouter
              containerComponent={ButtonGroupRouterContainer}
              key={forceUpdateKey}
              selected={type}
              onChange={setType}
              routes={SETTINGS_ROUTES}
              routeProps={{
                toggle,
              }}
            />
          </>
        )}
      </LockedResourceOverlay>
    </Modal>
  );
};

const mapStateToProps = {
  skillID: Skill.activeSkillIDSelector,
};

export default connect(mapStateToProps)(SettingsModal);
