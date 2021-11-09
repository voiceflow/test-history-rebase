import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import { HeaderVariant } from '@/components/Section/components/HeaderLabel';
import { EngineContext } from '@/pages/Canvas/contexts';

import { DEFAULT_BACKGROUND_COLOR } from '../../constants';
import BackgroundColorSlider from './components/BackgroundColorSlider';

export interface BackgroundColorProps {
  nodeID: string;
}

const BackgroundColor: React.FC<BackgroundColorProps> = ({ nodeID }) => {
  const engine = React.useContext(EngineContext)!;
  const { backgroundColor } = engine.getDataByNodeID<Realtime.Markup.NodeData.Text>(nodeID);

  const updateBackgroundColor = (newColor: Realtime.Markup.Color | null) => {
    engine.node.updateData<Realtime.Markup.NodeData.Text>(nodeID, { backgroundColor: newColor });
  };

  const handleToggleChange = (collapsed: boolean) => {
    if (collapsed) {
      updateBackgroundColor(null);
    } else if (!backgroundColor) {
      updateBackgroundColor(DEFAULT_BACKGROUND_COLOR);
    }
  };

  return (
    <Section
      header="Background"
      headerVariant={HeaderVariant.ADD}
      initialOpen={backgroundColor != null}
      collapseVariant={SectionToggleVariant.ADD}
      onToggleChange={handleToggleChange}
    >
      <BackgroundColorSlider color={backgroundColor ?? DEFAULT_BACKGROUND_COLOR} onChangeColor={updateBackgroundColor} />
    </Section>
  );
};

export default BackgroundColor;
