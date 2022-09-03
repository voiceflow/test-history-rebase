import { useDispatch as useLoguxDispatch } from '@logux/redux';
import { Utils } from '@voiceflow/common';
import { BlockText, Box, Button, ButtonVariant, Modal, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import type { useDispatch } from '@/hooks';

import manager from '../manager';

export interface Props {
  title: React.ReactNode;
  header: React.ReactNode;
  maxWidth?: number;
  onUpgrade: (dispatch: ReturnType<typeof useDispatch>) => void;
  description: React.ReactNode;
  cancelButtonText?: string;
  upgradeButtonText?: string;
}

const Upgrade = manager.create<Props>(
  'Upgrade',
  () =>
    ({ api, type, opened, title, header, hidden, animated, onUpgrade, description, cancelButtonText = 'Cancel', upgradeButtonText = 'Upgrade' }) => {
      const dispatch = useLoguxDispatch();

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={400}>
          <Modal.Header actions={<Modal.Header.CloseButton onClick={api.close} />}>{header}</Modal.Header>

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
            <Button onClick={() => api.close()} variant={ButtonVariant.TERTIARY} squareRadius>
              {cancelButtonText}
            </Button>

            <Button onClick={Utils.functional.chainVoid(api.close, () => onUpgrade(dispatch))} variant={ButtonVariant.PRIMARY} squareRadius>
              {upgradeButtonText}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default Upgrade;
