import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { EngineContext } from '@/pages/Canvas/contexts';

import { DEFAULT_BACKGROUND_COLOR } from '../../constants';
import BackgroundColorSlider from './components/BackgroundColorSlider';

export interface BackgroundColorProps {
  nodeID: string;
  data: Realtime.NodeData<Realtime.Markup.NodeData.Text>;
}

const BackgroundColor: React.FC<BackgroundColorProps> = ({ nodeID, data }) => {
  const engine = React.useContext(EngineContext)!;

  const updateBackgroundColor = (newColor: Realtime.Markup.Color | null) => {
    engine.node.updateData<Realtime.Markup.NodeData.Text>(nodeID, { backgroundColor: newColor });
  };

  const collapsed = !data.backgroundColor;

  return (
    <SectionV2.ActionCollapseSection
      title={<SectionV2.Title bold={!collapsed}>Background</SectionV2.Title>}
      action={
        collapsed ? (
          <SectionV2.AddButton onClick={() => updateBackgroundColor(DEFAULT_BACKGROUND_COLOR)} />
        ) : (
          <SectionV2.RemoveButton onClick={() => updateBackgroundColor(null)} />
        )
      }
      collapsed={collapsed}
      contentProps={{ bottomOffset: 2.5 }}
    >
      <BackgroundColorSlider
        color={data.backgroundColor ?? DEFAULT_BACKGROUND_COLOR}
        onChangeColor={updateBackgroundColor}
      />
    </SectionV2.ActionCollapseSection>
  );
};

export default BackgroundColor;
