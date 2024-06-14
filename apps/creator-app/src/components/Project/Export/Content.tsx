import { Animations, Box, Switch, Title } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import { ExportType } from '@/constants';

import { Canvas } from './Canvas';
import { EXPORT_TYPE_OPTIONS } from './constants';
import { ProjectExportContext } from './Context';
import { Model } from './Model';

export const Content: React.FC<{
  checkedItems?: string[];
  withDataTypes?: boolean;
  disableAnimation?: boolean;
}> = ({ checkedItems, withDataTypes = true, disableAnimation }) => {
  const { exportType, setExportType } = React.useContext(ProjectExportContext)!;

  const Container = (disableAnimation ? Box : Animations.FadeLeft) as typeof Box;

  return (
    <Container fullWidth style={{ height: '100%' }} paddingTop={24} paddingX={32}>
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
    </Container>
  );
};
