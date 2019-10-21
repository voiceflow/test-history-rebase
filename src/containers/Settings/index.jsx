import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Modal, { ModalHeader } from '@/components/Modal';
import { activeSkillIDSelector } from '@/ducks/skill';
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

function SettingsModal({ open, toggle, type = Settings.BASIC, setType }) {
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle} header="Project Settings" />
      <div className="settings pb-3">
        <ButtonGroupRouter selected={type} onChange={setType} routes={SettingsOptions} routeProps={{ toggle }} />
      </div>
    </Modal>
  );
}

const mapStateToProps = {
  skillID: activeSkillIDSelector,
};

export default connect(mapStateToProps)(SettingsModal);
