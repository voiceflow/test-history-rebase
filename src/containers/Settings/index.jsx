import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Modal, { ModalHeader } from '@/components/Modal';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';

import AdvancedSettings from './Advanced';
import BackupSettings from './Backups';
import BasicSettings from './Basic';

export const Settings = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  DISCOVERY: 'discovery',
  BACKUPS: 'backups',
};

const SettingsOptions = [
  {
    value: Settings.BASIC,
    label: 'Basic',
    component: BasicSettings,
  },
  {
    value: Settings.ADVANCED,
    label: 'Advanced',
    component: AdvancedSettings,
  },
  {
    value: Settings.BACKUPS,
    label: 'Backups',
    component: BackupSettings,
  },
];

const SettingsModal = ({ open, toggle, type = Settings.BASIC, setType }) => {
  const updateType = React.useCallback((nextType) => setType(nextType), [setType]);

  return (
    <Modal isOpen={open} toggle={toggle}>
      <LockedResourceOverlay type={Realtime.ResourceType.SETTINGS} disabled={!open}>
        {({ forceUpdateKey }) => (
          <>
            <ModalHeader toggle={toggle} header="Project Settings" />
            <div className="settings pb-3">
              <ButtonGroupRouter key={forceUpdateKey} selected={type} onChange={updateType} routes={SettingsOptions} routeProps={{ toggle }} />
            </div>
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
