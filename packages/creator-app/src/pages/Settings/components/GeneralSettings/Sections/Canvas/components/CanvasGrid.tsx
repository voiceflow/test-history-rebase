import { Box, SectionV2, Text, Toggle } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';

const CanvasGrid: React.FC = () => {
  const canvasGridEnabled = useSelector(UI.isCanvasGridEnabledSelector);
  const toggleCanvasGrid = useDispatch(UI.toggleCanvasGrid);

  return (
    <SettingsSection variant={SectionVariants.PRIMARY}>
      <SettingsSubSection growInput={false} topOffset={3}>
        <Box.FlexApart width="100%">
          <div>
            <SectionV2.Title bold>
              <Text>Canvas Grid</Text>
            </SectionV2.Title>
            <Box mt={4}>
              <Text color="#62778c" fontSize="13px">
                When on, the canvas will have a dotted background grid.
              </Text>
            </Box>
          </div>
          <Toggle checked={canvasGridEnabled} size={Toggle.Size.EXTRA_SMALL} onChange={toggleCanvasGrid} hasLabel />
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default CanvasGrid;
