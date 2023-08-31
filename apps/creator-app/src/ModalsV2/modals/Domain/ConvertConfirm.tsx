import { BlockText, Button, Link, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Documentation from '@/config/documentation';
import { LimitType } from '@/constants/limits';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, usePlanLimitConfig, useSelector } from '@/hooks';

import { useModal } from '../../hooks';
import manager from '../../manager';
import Upgrade from '../Upgrade';

export interface Props {
  sourceProjectID: string;
  targetProjectID: string;
}

const ConvertConfirm = manager.create<Props>(
  'DomainConvertConfirm',
  () =>
    ({ api, type, opened, hidden, animated, closePrevented, sourceProjectID, targetProjectID }) => {
      const targetProject = useSelector(ProjectV2.projectByIDSelector, { id: targetProjectID });
      const sourceProject = useSelector(ProjectV2.projectByIDSelector, { id: sourceProjectID });

      const mergeProjects = useDispatch(ProjectV2.mergeProjects);

      const upgradeModal = useModal(Upgrade);
      const domainsLimitConfig = usePlanLimitConfig(LimitType.DOMAINS);

      const onConfirm = async () => {
        if (!targetProject || !sourceProject) {
          toast.genericError();
          return;
        }

        try {
          const [{ domains: targetDomains = [] }, { domains: sourceDomains = [] }] = await Promise.all([
            client.api.version.get(targetProject.versionID, ['domains']),
            client.api.version.get(sourceProject.versionID, ['domains']),
          ]);

          if (domainsLimitConfig && targetDomains.length + sourceDomains.length >= domainsLimitConfig.limit) {
            upgradeModal.openVoid(domainsLimitConfig.upgradeModal());
            return;
          }

          api.preventClose();

          await mergeProjects(sourceProjectID, targetProjectID);

          toast.success(`Domain transfer successful.`);

          api.enableClose();
          api.close();
        } catch {
          api.enableClose();
          toast.genericError();
        }
      };

      return (
        <Modal type={type} maxWidth={400} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} disabled={closePrevented} />}>
            Confirm Domain Transfer
          </Modal.Header>

          <Modal.Body>
            <BlockText mb={16}>
              Merging data with an assistant creates the potential for conflicts (e.g. intents or entities with the same name, duplicate utterance
              data etc.). Please read <Link href={Documentation.DOMAINS_PROJECT_TRANSFER}>this documentation</Link> to understand how these conflicts
              will be handled.
            </BlockText>

            <BlockText>
              When a domain is transferred, we’ll create a duplicate of the assistant being transferred, and we’ll create a new version of the target
              assistant in the state before the transfer.
            </BlockText>
          </Modal.Body>

          <Modal.Footer gap={12}>
            <Button onClick={() => api.close()} disabled={closePrevented} variant={Button.Variant.TERTIARY} squareRadius>
              Cancel
            </Button>

            <Button minWidth={105} onClick={onConfirm} isLoading={closePrevented} disabled={closePrevented} squareRadius>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
);

export default ConvertConfirm;
