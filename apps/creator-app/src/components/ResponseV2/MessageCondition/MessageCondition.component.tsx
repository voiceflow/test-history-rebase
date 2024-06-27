import { Utils } from '@voiceflow/common';
import { ConditionType } from '@voiceflow/dtos';
import { Button, Menu, Popper } from '@voiceflow/ui-next';
import React from 'react';

import { buttonStyles } from './MessageCondition.css';
import type { IMessageCondition } from './MessageCondition.interface';

const CONDITION_TYPE_LABEL_MAP: Record<ConditionType, string> = {
  [ConditionType.EXPRESSION]: 'Expression builder',
  [ConditionType.SCRIPT]: 'Javascript',
  [ConditionType.PROMPT]: 'Prompt',
};

export const MessageCondition: React.FC<IMessageCondition> = () => (
  <Popper
    placement="bottom"
    disableLayers
    referenceElement={({ onOpen, ref, isOpen }) => (
      <Button
        className={buttonStyles}
        variant="tertiary"
        label="Condition"
        isActive={isOpen}
        onClick={onOpen}
        iconName="If"
        size="small"
        ref={ref}
      />
    )}
  >
    {({ onClose }) => (
      <Menu width="fit-content">
        <Menu.Item
          prefixIconName="If"
          label={CONDITION_TYPE_LABEL_MAP[ConditionType.EXPRESSION]}
          onClick={Utils.functional.chain(onClose, () => ConditionType.EXPRESSION)}
        />
        <Menu.Item
          prefixIconName="Code"
          label={CONDITION_TYPE_LABEL_MAP[ConditionType.SCRIPT]}
          onClick={Utils.functional.chain(onClose, () => ConditionType.SCRIPT)}
        />
        <Menu.Item
          prefixIconName="IfPrompt"
          label={CONDITION_TYPE_LABEL_MAP[ConditionType.PROMPT]}
          onClick={Utils.functional.chain(onClose, () => ConditionType.PROMPT)}
        />
      </Menu>
    )}
  </Popper>
);
