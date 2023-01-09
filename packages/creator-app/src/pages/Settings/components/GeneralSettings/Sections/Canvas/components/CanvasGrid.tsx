import { Box, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector } from '@/hooks';

const CanvasGrid: React.FC = () => {
  const canvasGridEnabled = useSelector(UI.isCanvasGridEnabledSelector);
  const toggleCanvasGrid = useDispatch(UI.toggleCanvasGrid);

  return (
    <Settings.Section>
      <Settings.Card>
        <Settings.SubSection contentProps={{ topOffset: 3 }}>
          <Box.FlexApart>
            <div>
              <Settings.SubSection.Title>Canvas Grid</Settings.SubSection.Title>

              <Settings.SubSection.Description>When on, the canvas will have a dotted background grid.</Settings.SubSection.Description>
            </div>

            <Toggle checked={canvasGridEnabled} size={Toggle.Size.EXTRA_SMALL} onChange={toggleCanvasGrid} hasLabel />
          </Box.FlexApart>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default CanvasGrid;
