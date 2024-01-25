import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, SquareButton, Table, toast, Tooltip } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import pluralize from 'pluralize';
import React from 'react';

import { UpgradeTooltipPlanPermission } from '@/config/planPermission';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFeature } from '@/hooks/feature';
import { useConfirmV2Modal, useModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { CMSResourceActionsButton } from '@/pages/AssistantCMS/components/CMSResourceActions/CMSResourceActionsButton/CMSResourceActionsButton.component';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { useKnowledgeBaseCMSManager } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseTableNavigationRefreshRateButton } from './CMSKnowledgeBaseTableNavigationRefreshRateButton.component';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const { isEnabled: isIntegrationsEnabled } = useFeature(Realtime.FeatureFlag.KNOWLEDGE_BASE_INTEGRATIONS);
  const refreshRatePermission = usePermission(Permission.KB_REFRESH_RATE);

  const confirmModal = useConfirmV2Modal();
  const manageIntegrationsModal = useModal(Modals.KnowledgeBase.ManageIntegrations);

  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);

  const tableState = Table.useStateMolecule();
  const cmsManager = useKnowledgeBaseCMSManager();
  const getAtomValue = useGetAtomValue();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const effects = useAtomValue(cmsManager.effects);
  const count = useAtomValue(cmsManager.dataToRenderSize);
  const deleteMany = useDispatch(effects.deleteMany);

  const onResync = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);

    setSelectedIDs(new Set());

    await resyncMany(Array.from(selectedIDs));
  };

  const onConfirmDelete = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);
    const numSelected = selectedIDs.size;

    await deleteMany(Array.from(selectedIDs));
    setSelectedIDs(new Set());

    toast.info(`${pluralize('data source', numSelected, true)} deleted`, { showIcon: false });
  };

  const onDataSourcesDelete = () => {
    const { size } = getAtomValue(tableState.selectedIDs);

    confirmModal.openVoid({
      body: `Deleted data sources won’t be recoverable. Please confirm that you want to continue.`,
      title: `Delete data sources (${size})`,
      confirm: onConfirmDelete,
      confirmButtonLabel: 'Delete forever',
      confirmButtonVariant: 'alert',
    });
  };

  const upgradeTooltip =
    !refreshRatePermission.planAllowed &&
    refreshRatePermission.planConfig &&
    (refreshRatePermission.planConfig as UpgradeTooltipPlanPermission<any>).upgradeTooltip({});

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          {isRefreshEnabled && (
            <>
              <Button label="Re-sync" iconName="Sync" size="medium" variant="secondary" onClick={onResync} />

              <CMSKnowledgeBaseTableNavigationRefreshRateButton upgradeTooltip={upgradeTooltip} />
            </>
          )}
          <CMSResourceActionsButton label="Delete" iconName="Trash" onClick={onDataSourcesDelete} />
        </>
      }
    >
      {isIntegrationsEnabled && (
        <Tooltip
          placement="bottom"
          referenceElement={({ ref, onOpen, onClose }) => (
            <SquareButton
              ref={ref}
              iconName="Integration"
              onMouseEnter={onOpen}
              onMouseLeave={onClose}
              onClick={() => manageIntegrationsModal.openVoid()}
            />
          )}
        >
          {() => (
            <Box width="68px" height="17px">
              <Tooltip.Caption>Integrations</Tooltip.Caption>
            </Box>
          )}
        </Tooltip>
      )}
    </CMSTableNavigation>
  );
};
