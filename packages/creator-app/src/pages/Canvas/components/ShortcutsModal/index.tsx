import React from 'react';

import Modal, { ModalBody } from '@/components/Modal';
import { FeatureFlag } from '@/config/features';
import { ModalType } from '@/constants';
import { useFeature } from '@/hooks';

import { Shortcut } from './components';
import { SHORTCUTS } from './constants';

const ShortcutsModal: React.FC = () => {
  const navigationRedesign = useFeature(FeatureFlag.NAVIGATION_REDESIGN);

  return (
    <Modal id={ModalType.SHORTCUTS} title="Keyboard Shortcuts">
      <ModalBody>
        {SHORTCUTS.map(
          ({ title, command, shouldRender }, index) =>
            (!shouldRender || shouldRender({ navigationRedesignEnabled: !!navigationRedesign.isEnabled })) && (
              <Shortcut key={index} title={title} command={command} />
            )
        )}
      </ModalBody>
    </Modal>
  );
};

export default ShortcutsModal;
