import { Dropdown, System } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';

export interface HeaderOptionsProps {
  onRename: () => void;
  itemType: InteractionModelTabType;
  isBuiltIn?: boolean;
  selectedID: string;
}

const HeaderOptions: React.FC<HeaderOptionsProps> = ({ onRename, isBuiltIn, selectedID, itemType }) => {
  const { options } = useNLUItemMenu({ itemID: selectedID, itemType, isBuiltIn, onRename });

  return options.length ? (
    <Dropdown placement="bottom-end" selfDismiss options={options}>
      {({ ref, onToggle, isOpen }) => (
        <System.IconButtonsGroup.Base mr={0}>
          <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={onToggle} iconProps={{ size: 14 }} />
        </System.IconButtonsGroup.Base>
      )}
    </Dropdown>
  ) : null;
};

export default HeaderOptions;
