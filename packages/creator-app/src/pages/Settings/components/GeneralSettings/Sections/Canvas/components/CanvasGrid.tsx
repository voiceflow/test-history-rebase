import { Box, SectionV2, Toggle } from '@voiceflow/ui';
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
          <Box>
            <SectionV2.Title bold>Canvas Grid</SectionV2.Title>

            <SectionV2.Description mt={4} block secondary>
              When on, the canvas will have a dotted background grid.
            </SectionV2.Description>
          </Box>

          <Toggle checked={canvasGridEnabled} size={Toggle.Size.EXTRA_SMALL} onChange={toggleCanvasGrid} hasLabel />
        </Box.FlexApart>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default CanvasGrid;
