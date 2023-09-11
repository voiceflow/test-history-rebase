import { Utils } from '@voiceflow/common';
import { ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { Dropdown, Menu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';

import { RESPONSE_VARIANT_TYPE_LABEL_MAP } from '../Response.constant';
import { dropdownStyles } from './ResponseVariantTypeDropdown.css';
import type { IResponseVariantTypeDropdown } from './ResponseVariantTypeDropdown.interface';

export const ResponseVariantTypeDropdown: React.FC<IResponseVariantTypeDropdown> = ({ value, onValueChange }) => (
  <Dropdown value={RESPONSE_VARIANT_TYPE_LABEL_MAP[value]} isSmall bordered={false} placement="bottom-start" className={dropdownStyles}>
    {({ onClose }) => (
      <Menu width="fit-content">
        <MenuItem
          label={RESPONSE_VARIANT_TYPE_LABEL_MAP[ResponseVariantType.TEXT]}
          onClick={Utils.functional.chain(onClose, () => onValueChange(ResponseVariantType.TEXT))}
        />

        <MenuItemWithTooltip
          label={RESPONSE_VARIANT_TYPE_LABEL_MAP[ResponseVariantType.PROMPT]}
          tooltip={{ width: 200 }}
          onClick={Utils.functional.chain(onClose, () => onValueChange(ResponseVariantType.PROMPT))}
        >
          {() => (
            <TooltipContentLearn
              label="Use AI models, memory & knowledge base data to generate agent responses."
              // TODO: add link to docs
              onLearnClick={Utils.functional.noop}
            />
          )}
        </MenuItemWithTooltip>

        <MenuItem
          label={RESPONSE_VARIANT_TYPE_LABEL_MAP[ResponseVariantType.JSON]}
          onClick={Utils.functional.chain(onClose, () => onValueChange(ResponseVariantType.JSON))}
        />
      </Menu>
    )}
  </Dropdown>
);
