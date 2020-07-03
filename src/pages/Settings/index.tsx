import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import Modal, { ModalHeader } from '@/components/LegacyModal';
import * as Realtime from '@/ducks/realtime';
import { useDidUpdateEffect, useTrackingEvents } from '@/hooks';
import { LockedResourceOverlay } from '@/pages/Canvas/components/LockedEditorOverlay';

import { ButtonGroupRouterContainer } from './components';
import { SETTINGS_ROUTES, SettingsRoute } from './constants';

export type SettingsModalProps = {
  open?: boolean;
  type?: SettingsRoute;
  toggle?: () => void;
  setType?: (type: SettingsRoute) => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, toggle, type = SettingsRoute.BASIC, setType }) => {
  const [trackingEvents] = useTrackingEvents();

  useDidUpdateEffect(() => {
    if (open) {
      trackingEvents.trackActiveProjectSettingsOpened();
    }
  }, [open]);

  return (
    <Modal isOpen={open} toggle={toggle}>
      <LockedResourceOverlay type={Realtime.ResourceType.SETTINGS} disabled={!open}>
        {({ forceUpdateKey }) => (
          <>
            <ModalHeader className="modal-title" toggle={toggle} header="Project Settings" />
            <ButtonGroupRouter
              containerComponent={ButtonGroupRouterContainer}
              key={forceUpdateKey!}
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

export default SettingsModal;
