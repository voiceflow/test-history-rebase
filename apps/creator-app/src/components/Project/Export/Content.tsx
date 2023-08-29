import { Animations, Box, Switch, Title } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import { ExportType } from '@/constants';

import { Canvas } from './Canvas';
import { EXPORT_TYPE_OPTIONS } from './constants';
import { Context } from './Context';
import { Model } from './Model';

export const Content: React.FC<{
  withDataTypes?: boolean;
  checkedItems?: string[];
}> = ({ checkedItems, withDataTypes = true }) => {
  const { exportType, setExportType } = React.useContext(Context)!;

  return (
    <Animations.FadeLeft style={{ height: '100%' }} paddingTop={24} paddingX={32}>
      <Title fontSize={15} mb={16} textAlign="left">
        Export Type
      </Title>

      {withDataTypes && (
        <Box mb={16}>
          <RadioGroup isFlat options={EXPORT_TYPE_OPTIONS} checked={exportType} onChange={setExportType} />
        </Box>
      )}

      <Switch active={exportType}>
        <Switch.Pane value={ExportType.MODEL}>
          <Model selectedIntentsIds={checkedItems} />
        </Switch.Pane>

        <Switch.Pane value={ExportType.CANVAS}>
          <Canvas />
        </Switch.Pane>
      </Switch>
    </Animations.FadeLeft>
  );
};
