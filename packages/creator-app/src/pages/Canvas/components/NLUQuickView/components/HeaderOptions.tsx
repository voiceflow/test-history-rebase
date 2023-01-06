import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';

export interface HeaderOptionsProps {
  selectedID: string;
  onRename: () => void;
  itemType: InteractionModelTabType;
  isBuiltIn?: boolean;
}

const HeaderOptions: React.OldFC<HeaderOptionsProps> = ({ onRename, isBuiltIn, selectedID, itemType }) => {
  const { options } = useNLUItemMenu({ itemID: selectedID, itemType, isBuiltIn, onRename });

  return options.length ? (
    <Dropdown placement="bottom-end" selfDismiss options={options}>
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
