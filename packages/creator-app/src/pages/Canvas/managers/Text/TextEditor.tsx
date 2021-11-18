import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as Documentation from '@/config/documentation';
import TextList from '@/pages/Canvas/components/TextList';
import TextListItem from '@/pages/Canvas/components/TextListItem';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const TextEditor: NodeEditor<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = ({ data, onChange }) => {
  const canvasVisibilityOption = useCanvasVisibilityOption(data.canvasVisibility, (canvasVisibility) => onChange({ canvasVisibility }));

  return (
    <TextList
      items={data.texts}
      renderMenu={() => <OverflowMenu placement="top" options={[canvasVisibilityOption]} />}
      onChangeItems={(texts) => onChange({ texts })}
      itemComponent={TextListItem}
      howItWorksLink={Documentation.TEXT_STEP}
    />
  );
};

export default TextEditor;
