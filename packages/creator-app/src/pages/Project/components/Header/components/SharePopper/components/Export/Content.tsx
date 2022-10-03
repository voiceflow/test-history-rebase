import { Box, Title } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import { TabPane, TabsContent } from '@/components/Tabs';
import { ExportType } from '@/constants';
import { FadeLeftContainer } from '@/styles/animations';

import { Canvas, Model } from './components';
import { EXPORT_TYPE_OPTIONS } from './constants';
import { ExportContext } from './Context';

const Content: React.FC<{
  withDataTypes?: boolean;
  checkedItems?: string[];
}> = ({ checkedItems, withDataTypes = true }) => {
  const { exportType, setExportType } = React.useContext(ExportContext)!;

  return (
    <FadeLeftContainer style={{ height: '100%' }} paddingTop={24} paddingX={32}>
      <Title fontSize={15} mb={16} textAlign="left">
        Export Type
      </Title>

      {withDataTypes && (
        <Box mb={16}>
          <RadioGroup isFlat options={EXPORT_TYPE_OPTIONS} checked={exportType} onChange={setExportType} />
        </Box>
      )}

      <TabsContent selected={exportType}>
        <TabPane tabID={ExportType.MODEL}>
          <Model selectedIntentsIds={checkedItems} />
        </TabPane>

        <TabPane tabID={ExportType.CANVAS}>
          <Canvas />
        </TabPane>
      </TabsContent>
    </FadeLeftContainer>
  );
};

export default Content;
