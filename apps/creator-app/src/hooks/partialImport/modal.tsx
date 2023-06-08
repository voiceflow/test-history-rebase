import { Box, Button, Modal, Spinner, Text, ThemeColor, toast, useAsyncMountUnmount } from '@voiceflow/ui';
import dayjs from 'dayjs';
import { produce } from 'immer';
import React from 'react';

import client from '@/client';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import { useStore } from '@/hooks/redux';
import manager from '@/ModalsV2/manager';

import { Diff, getDiff, VF_FILE, VFDiff } from './diff';
import DiffItem from './diffItem';

interface PartialImportManagerProps {
  next: VF_FILE;
}

const PartialImportManager = manager.create<PartialImportManagerProps>(
  'PartialImportManager',
  () =>
    ({ next, api, type, opened, hidden, animated, closePrevented }) => {
      const [diff, setDiff] = React.useState<VFDiff | null>(null);
      const [saving, setSaving] = React.useState<boolean>(false);

      const store = useStore();

      const targetDomain = React.useMemo(() => Domain.active.domainSelector(store.getState()), []);

      useAsyncMountUnmount(async () => {
        const versionID = Session.activeVersionIDSelector(store.getState())!;
        const current = await client.api.version.export(versionID);
        setDiff(getDiff(next, current));
      });

      const toggleDiff = React.useCallback(
        (resource: keyof VFDiff['diff'], index: number) => () => {
          setDiff((prev) =>
            produce(prev, (draft) => {
              if (!draft) return;
              draft.diff[resource][index].useNext = !draft.diff[resource][index].useNext;
            })
          );
        },
        []
      );

      const save = async () => {
        try {
          if (saving) return;

          toast.info('Saving Imports...');

          setSaving(true);

          const useNextToMerge = Object.fromEntries(
            Object.entries(diff?.diff || {}).map(([key, value]: [string, Diff<unknown>[]]) => [
              key,
              value.filter((item) => item.useNext).map((item) => item.nextResource),
            ])
          );

          await client.api.fetch.post(`/versions/${Session.activeVersionIDSelector(store.getState())}/import`, {
            ...useNextToMerge,
            targetDomainID: targetDomain?.id,
          });

          // reload the window to get the new version
          window.location.reload();
        } finally {
          setSaving(false);
        }
      };

      return (
        <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={900}>
          <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
            Import Project
          </Modal.Header>

          {!diff ? (
            <Box py={128}>
              <Spinner borderLess />
            </Box>
          ) : (
            <>
              <Modal.Body mt={16}>
                <Box mb={11} color={ThemeColor.SECONDARY} fontSize={13}>
                  <b>Project Name:</b> {next.project.name}
                  <br />
                  Last Updated {dayjs(next.project.updatedAt).format('h:mmA, MMM D, YYYY')}
                </Box>

                <Box>
                  <hr />
                  <Box.FlexApart mb={11} fontWeight={600}>
                    Intents
                    <Box fontSize={13} color={ThemeColor.SECONDARY}>
                      Current | Imported
                    </Box>
                  </Box.FlexApart>
                  {diff.diff.intents.map((intent, index) => (
                    <DiffItem key={intent.nextResource.key} diff={intent} toggleDiff={toggleDiff('intents', index)} />
                  ))}
                </Box>

                <Box>
                  <hr />
                  <Box.FlexApart mb={11} fontWeight={600}>
                    Entities
                    <Box fontSize={13} color={ThemeColor.SECONDARY}>
                      Current | Imported
                    </Box>
                  </Box.FlexApart>
                  {diff.diff.entities.map((intent, index) => (
                    <DiffItem key={intent.nextResource.key} diff={intent} toggleDiff={toggleDiff('entities', index)} />
                  ))}
                </Box>
                <Box>
                  <hr />
                  <Box.FlexApart mb={11} fontWeight={600}>
                    <Box>
                      Topics&nbsp;&nbsp;
                      <Text fontSize={13} fontWeight={400}>
                        (merging into <b>{targetDomain?.name}</b>)
                      </Text>
                    </Box>
                    <Box fontSize={13} color={ThemeColor.SECONDARY}>
                      Current | Imported
                    </Box>
                  </Box.FlexApart>
                  {diff.diff.topics.map((intent, index) => (
                    <DiffItem key={intent.nextResource._id} diff={intent} toggleDiff={toggleDiff('topics', index)} />
                  ))}
                </Box>
                <Box>
                  <hr />
                  <Box.FlexApart mb={11} fontWeight={600}>
                    Components
                    <Box fontSize={13} color={ThemeColor.SECONDARY}>
                      Current | Imported
                    </Box>
                  </Box.FlexApart>
                  {diff.diff.components.map((intent, index) => (
                    <DiffItem key={intent.nextResource._id} diff={intent} toggleDiff={toggleDiff('components', index)} />
                  ))}
                </Box>
              </Modal.Body>
              <Modal.Footer gap={12}>
                <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented || saving} squareRadius>
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
