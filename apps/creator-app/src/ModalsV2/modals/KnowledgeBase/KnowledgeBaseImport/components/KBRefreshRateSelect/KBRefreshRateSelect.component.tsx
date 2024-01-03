import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Dropdown, Menu, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { IRefreshRateSelect } from './RefreshRateSelect.interface';

export const KBRefreshRateSelect: React.FC<IRefreshRateSelect> = ({
  value = BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER,
  disabled,
  onValueChange,
}) => {
  const rateOrder = [
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.DAILY,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.WEEKLY,
    BaseModels.Project.KnowledgeBaseDocumentRefreshRate.MONTHLY,
  ];

  return (
    <>
      <Box direction="column">
        <Dropdown value={Utils.string.capitalizeFirstLetter(value)} label="Refresh rate" disabled={disabled}>
          {({ onClose }) => (
            <Menu>
              {rateOrder.map((rate) => (
                <Menu.Item
                  key={rate}
                  label={Utils.string.capitalizeFirstLetter(rate)}
                  onClick={Utils.functional.chainVoid(onClose, () => onValueChange(rate))}
                />
              ))}
            </Menu>
          )}
        </Dropdown>

        <Box mt={6}>
          <Text color={Tokens.colors.neutralDark.neutralsDark50} variant="fieldCaption">
            How often will the data source sync.
          </Text>
        </Box>
      </Box>
    </>
  );
};
