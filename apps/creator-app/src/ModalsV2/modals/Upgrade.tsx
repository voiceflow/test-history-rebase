import { Utils } from '@voiceflow/common';
import { BlockText, Box, Button, Modal, SvgIcon, useSetup } from '@voiceflow/ui';
import React from 'react';

import type { UpgradePrompt } from '@/ducks/tracking';
import { useStore, useTrackingEvents } from '@/hooks';

import manager from '../manager';

export interface UpgradeModal {
  title: React.ReactNode;
  header: React.ReactNode;
  maxWidth?: number;
  onUpgrade: (dispatch: ReturnType<typeof useStore>['dispatch']) => void;
  description: React.ReactNode;
  upgradePrompt?: UpgradePrompt;
  cancelButtonText?: React.ReactNode;
  upgradeButtonText: React.ReactNode;
}

const Upgrade = manager.create<UpgradeModal>(
  'Upgrade',
  () =>
    ({
      api,
      type,
      opened,
      title,
      header,
      hidden,
      maxWidth = 400,
      animated,
      onUpgrade,
      description,
      upgradePrompt,
      cancelButtonText = 'Cancel',
      upgradeButtonText = 'Upgrade',
    }) => {
      const store = useStore();

      const [trackingEvents] = useTrackingEvents();

      useSetup(() => {
        if (upgradePrompt) {
          trackingEvents.trackUpgradePrompt({ promptType: upgradePrompt });
        }
      });

      return (
        <Modal
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          onExited={api.remove}
          maxWidth={maxWidth}
        >
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>{header}</Modal.Header>

          <Modal.Body centred style={{ paddingTop: '16px' }}>
            <Box.FlexCenter>
              <SvgIcon icon="skillTemplate" size={80} />
            </Box.FlexCenter>

            <BlockText mt={16} fontWeight={600}>
              {title}
            </BlockText>

            <BlockText mt={8} color="#62778C">
              {description}
            </BlockText>
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} squareRadius>
              {cancelButtonText}
            </Button>

            <Button
              onClick={Utils.functional.chainVoid(api.onClose, () => onUpgrade(store.dispatch))}
              variant={Button.Variant.PRIMARY}
              squareRadius
            >
              {upgradeButtonText}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Upgrade;
