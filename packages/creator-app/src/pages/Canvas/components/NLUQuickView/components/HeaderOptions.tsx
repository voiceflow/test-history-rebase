import { Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as SlotDuck from '@/ducks/slot';
import { useDispatch } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { useDeleteVariable } from '@/pages/Canvas/components/NLUQuickView/hooks';

interface HeaderOptionsProps {
  selectedID: string;
  setIsActiveItemRename: (val: boolean) => void;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({ setIsActiveItemRename, selectedID }) => {
  const deleteIntent = useDispatch(Intent.deleteIntent);
  const deleteSlot = useDispatch(SlotDuck.deleteSlot);
  const { canRenameItem, canDeleteItem, activeTab } = React.useContext(NLUQuickViewContext);
  const deleteVariable = useDeleteVariable();

  const onDelete = () => {
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        deleteIntent(selectedID);
        break;
      case InteractionModelTabType.SLOTS:
        deleteSlot(selectedID);
        break;
      case InteractionModelTabType.VARIABLES:
        deleteVariable(selectedID);
        break;
      default:
        toast.error('Nothing to delete');
        break;
    }
  };

  const dropdownOptions = React.useMemo(() => {
    const options = [];
    const canRename = canRenameItem(selectedID, activeTab);
    const canDelete = canDeleteItem(selectedID, activeTab);

    if (canRename) {
      options.push({
        key: 'rename',
        label: 'Rename',
        onClick: () => setIsActiveItemRename(true),
      });
    }

    if (canDelete && canRename) {
      options.push({ key: 'divider-1', label: 'divider', divider: true });
    }
    if (canDelete) {
      options.push({
        key: 'delete',
        label: 'Delete',
        onClick: onDelete,
      });
    }
    return options;
  }, [selectedID, activeTab]);

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
