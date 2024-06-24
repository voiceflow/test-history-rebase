import { Utils } from '@voiceflow/common';
import { ResponseType } from '@voiceflow/dtos';
import { Dropdown, Menu } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';

import { RESPONSE_TYPE_LABEL_MAP } from '../Response.constant';
import { dropdownStyles } from './ResponseTypeDropdown.css';
import type { IResponseTypeDropdown } from './ResponseTypeDropdown.interface';

export const ResponseTypeDropdown: React.FC<IResponseTypeDropdown> = ({ value, onValueChange }) => (
  <Dropdown
    value={RESPONSE_TYPE_LABEL_MAP[value]}
    isSmall
    bordered={false}
    placement="bottom-start"
    className={dropdownStyles}
  >
    {({ onClose }) => (
      <Menu width="fit-content">
        <Menu.Item
          label={RESPONSE_TYPE_LABEL_MAP[ResponseType.MESSAGE]}
          onClick={Utils.functional.chain(onClose, () => onValueChange(ResponseType.MESSAGE))}
        />

        <MenuItemWithTooltip
          label={RESPONSE_TYPE_LABEL_MAP[ResponseType.PROMPT]}
          tooltip={{ width: 200 }}
          onClick={Utils.functional.chain(onClose, () => onValueChange(ResponseType.PROMPT))}
        >
          {() => (
            <TooltipContentLearn
              label="Use AI models, memory & knowledge base data to generate agent responses."
              // TODO: add link to docs
              onLearnClick={Utils.functional.noop}
            />
          )}
        </MenuItemWithTooltip>
      </Menu>
    )}
  </Dropdown>
);
