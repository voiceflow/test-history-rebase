import { Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType, NLPProvider, PlatformToNLPProvider } from '@/constants';
import { NLUContext } from '@/contexts';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { NLUManagerContext } from '@/pages/NLUManager/context';

interface HeaderOptionsProps {
  selectedID: string;
  onRename: () => void;
  itemType: InteractionModelTabType;
  isBuiltIn?: boolean;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({ onRename, isBuiltIn, selectedID, itemType }) => {
  const { deleteItem, canRenameItem, canDeleteItem } = React.useContext(NLUContext);
  const { activeTab, selectedItemId, exportItem } = React.useContext(NLUManagerContext);
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const project = useSelector(ProjectV2.getProjectByIDSelector)({ id: projectID });
  const onDelete = () => {
    if (itemType && selectedID) {
      deleteItem(selectedID, itemType);
    } else {
      toast.error('Nothing to delete');
    }
  };

  const dropdownOptions = React.useMemo(() => {
    const options = [];
    if (activeTab === InteractionModelTabType.INTENTS && selectedItemId) {
      const contextOptions = [
        {
          label: 'Export CSV',
          value: 'exportCSV',
          onClick: () => exportItem(selectedItemId, InteractionModelTabType.INTENTS, NLPProvider.VF_CSV),
        },
        {
          label: 'Export JSON',
          value: 'exportJSON',
          onClick: () => exportItem(selectedItemId, InteractionModelTabType.INTENTS, project?.platform && PlatformToNLPProvider[project.platform]),
        },
        { label: 'Divider', divider: true },
      ];
      options.push(...contextOptions);
    }

    const canRename = canRenameItem(selectedID, itemType);
    const canDelete = canDeleteItem(selectedID, itemType);

    if (canRename) {
      options.push({
        key: 'rename',
        label: 'Rename',
        onClick: () => onRename(),
      });
    }

    if (canDelete && canRename) {
      options.push({ key: 'divider-1', label: 'divider', divider: true });
    }
    if (canDelete) {
      options.push({
        key: 'delete',
        label: isBuiltIn ? 'Remove' : 'Delete',
        onClick: onDelete,
      });
    }
    return options;
  }, [selectedID, itemType, selectedItemId, activeTab]);

  return dropdownOptions.length ? (
    <Dropdown placement="bottom-end" selfDismiss options={dropdownOptions}>
      {(ref, onToggle, isOpened) => (
        <IconButton
          style={{ marginRight: '0px' }}
          size={14}
          icon="ellipsis"
          variant={IconButtonVariant.BASIC}
          onClick={onToggle}
          activeClick={isOpened}
          ref={ref}
        />
      )}
    </Dropdown>
  ) : null;
};

export default HeaderOptions;
