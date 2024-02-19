import { Box, Button, Modal, Spinner, System, ThemeColor, toast, useAsyncMountUnmount } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import client from '@/client';
import { designerClient } from '@/client/designer';
import { PARTIAL_IMPORT_LEARN_MORE } from '@/constants/link.constant';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import { lazyComponent } from '@/hocs/lazy';
import { useStore } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';

import { Diff, getDiff, VF_FILE, VFDiff } from './diff';

interface PartialImportManagerProps {
  next: VF_FILE;
  fileName: string;
}

const DiffManager = lazyComponent(() => import('./diffManager'), { forwardRef: false });

const PartialImportManager = manager.create<PartialImportManagerProps>(
  'PartialImportManager',
  () =>
    ({ next, fileName, api, type, opened, hidden, animated, closePrevented }) => {
      const [diff, setDiff] = React.useState<VFDiff | null>(null);
      const [saving, setSaving] = React.useState<boolean>(false);

      const store = useStore();

      useAsyncMountUnmount(async () => {
        const versionID = Session.activeVersionIDSelector(store.getState())!;
        const vfFile = (await designerClient.assistant.exportJSON(versionID)) as unknown as VF_FILE;

        setDiff(getDiff(next, vfFile));
      });

      const save = async () => {
        try {
          if (saving) return;

          toast.info('Saving Imports...');

          setSaving(true);

          const versionID = Session.activeVersionIDSelector(store.getState());
          if (!versionID) throw new Error('no version');

          await client.version.getVersionSnapshot(versionID, `import backup (${fileName})`);

          const useNextToMerge = Object.fromEntries(
            Object.entries(diff?.diff || {}).map(([key, value]: [string, Diff<unknown>[]]) => [
              key,
              value.filter((item) => item.useNext).map((item) => item.nextResource),
            ])
          );

          await client.api.fetch.post(`/versions/${Session.activeVersionIDSelector(store.getState())}/import`, {
            ...useNextToMerge,
            targetDomainID: Domain.active.domainSelector(store.getState())?.id,
          });

          // reload the window to get the new version
          window.location.reload();
        } finally {
          setSaving(false);
        }
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={900}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
            Import Project
          </Modal.Header>

          {!diff ? (
            <Box py={128}>
              <Spinner borderLess />
            </Box>
          ) : (
            <>
              <Modal.Body mt={16}>
                <Box mb={12} fontSize={13} color={ThemeColor.SECONDARY}>
                  <b>Project Name:</b> {next.project.name}
                  <br />
                  <b>Last Updated:</b> {dayjs(next.project.updatedAt).format('h:mmA, MMM D, YYYY')}
                </Box>
                <Box color={ThemeColor.SECONDARY}>
                  Select resources to import. <System.Link.Anchor href={PARTIAL_IMPORT_LEARN_MORE}>Learn More</System.Link.Anchor>
                </Box>
                <hr />
                <DiffManager diff={diff} setDiff={setDiff} />
              </Modal.Body>
              <Modal.Footer gap={12}>
                <Button onClick={api.onClose} variant={Button.Variant.TERTIARY} disabled={closePrevented || saving} squareRadius>
                  Cancel
                </Button>
                <Button disabled={closePrevented || saving} onClick={save} squareRadius>
                  Import
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      );
    }
);

export default PartialImportManager;
