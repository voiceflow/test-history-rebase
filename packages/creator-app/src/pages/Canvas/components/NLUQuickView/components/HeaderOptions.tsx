import { Dropdown, IconButton, IconButtonVariant, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as SlotDuck from '@/ducks/slot';
import { useDispatch } from '@/hooks';
import { NLU_TAB_META } from '@/pages/Canvas/components/NLUQuickView/constants';

interface HeaderOptionsProps {
  activeTab: InteractionModelTabType;
  selectedID: string;
  setIsActiveItemRename: (val: boolean) => void;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({ setIsActiveItemRename, activeTab, selectedID }) => {
  const deleteIntent = useDispatch(Intent.deleteIntent);
  const deleteSlot = useDispatch(SlotDuck.deleteSlot);
  const tabMeta = NLU_TAB_META[activeTab];

  const onDelete = () => {
    switch (activeTab) {
      case InteractionModelTabType.INTENTS:
        deleteIntent(selectedID);
        break;
      case InteractionModelTabType.SLOTS:
        deleteSlot(selectedID);
        break;
      case InteractionModelTabType.VARIABLES:
        // TODO: variable delete
        break;
      default:
        toast.error('Nothing to delete');
        break;
    }
  };

  const additionalOptions = tabMeta.canRename
    ? [
        {
          key: 'rename',
          label: 'Rename',
          onClick: () => setIsActiveItemRename(true),
        },
        { key: 'divider-1', label: 'divider', divider: true },
      ]
    : [];

  const dropdownOptions = [
    ...additionalOptions,
    {
      key: 'delete',
      label: 'Delete',
      onClick: onDelete,
    },
  ];

  return (
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
  );
};

export default HeaderOptions;
