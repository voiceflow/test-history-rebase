import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { BlockType } from '@/constants';
import { NodeData } from '@/models';
import TextList from '@/pages/Canvas/components/TextList';
import TextListItem from '@/pages/Canvas/components/TextListItem';
import { useCanvasVisibilityOption } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const TextEditor: NodeEditor<NodeData.Text> = ({ data, onChange }) => {
  const canvasVisibilityOption = useCanvasVisibilityOption(data.canvasVisibility, (canvasVisibility) => onChange({ canvasVisibility }));

  return (
    <TextList
      items={data.texts}
      tutorial={{ content: <div />, blockType: BlockType.TEXT }}
      renderMenu={() => <OverflowMenu placement="top" options={[canvasVisibilityOption]} />}
      onChangeItems={(texts) => onChange({ texts })}
      itemComponent={TextListItem}
    />
  );
};

export default TextEditor;
