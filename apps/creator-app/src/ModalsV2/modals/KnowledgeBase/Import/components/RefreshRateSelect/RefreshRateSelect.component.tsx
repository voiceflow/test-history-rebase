import { Box, Dropdown, Menu, MenuItem, Text } from '@voiceflow/ui-next';
import React from 'react';

import { FieldLabel } from '../FieldLabel/FieldLabel.component';
import { RATES } from './RefreshRateSelect.constant';
import { captionStyles } from './RefreshRateSelect.css';
import { IRefreshRateSelect } from './RefreshRateSelect.interface';

export const RefreshRateSelect: React.FC<IRefreshRateSelect> = ({ onDropdownChange, isDisabled }) => {
  const [rate, setRate] = React.useState<string>('Never');

  return (
    <Box direction="column">
      <FieldLabel>Refresh rate</FieldLabel>
      <Dropdown disabled={isDisabled} value={rate} onChange={onDropdownChange}>
        {({ referenceRef, onClose }) => (
          <Menu width={`max(100%, ${referenceRef.current?.clientWidth ?? 0}px)`}>
            {RATES.map((item) => (
              <MenuItem
                key={item.id}
                label={item.label}
                id={item.id}
                onClick={() => {
                  setRate(item.label);
                  onClose();
                }}
              />
            ))}
          </Menu>
        )}
      </Dropdown>

      <Text className={captionStyles} variant="fieldCaption">
        How often will the data source sync.
      </Text>
    </Box>
  );
};
