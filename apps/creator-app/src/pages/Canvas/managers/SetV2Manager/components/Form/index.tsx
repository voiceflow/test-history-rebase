import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { MapManagedFactoryAPI, useMapManager, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import DraggableItem from '../DraggableItem';
import { Footer } from './components';

interface FormProps extends React.PropsWithChildren {
  editor: NodeEditorV2Props<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts>;
  header?: React.ReactNode;
  footer?:
    | React.ReactNode
    | ((props: { mapManager: MapManagedFactoryAPI<Realtime.NodeData.SetExpressionV2> }) => React.ReactNode);
  beforeList?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer, children, beforeList }) => {
  const MAX_SETS = 20;
  const DRAG_TYPE = 'set-editor';

  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(editor.data.sets, (sets) => editor.onChange({ sets }), {
    clone: ({ id }, cloneData) => ({ ...cloneData, id }),
    factory: (): Realtime.NodeData.SetExpressionV2 => ({
      id: Utils.id.cuid.slug(),
      type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
      variable: null,
      expression: '',
    }),
    maxItems: MAX_SETS,
  });

  return (
    <EditorV2
      header={header ?? <EditorV2.DefaultHeader />}
      footer={
        !isDragging &&
        (typeof footer === 'function' ? footer({ mapManager }) : footer ?? <Footer mapManager={mapManager} />)
      }
      dropLagAccept={DRAG_TYPE}
    >
      {beforeList}

      <DraggableList
        type={DRAG_TYPE}
        canDrag={!mapManager.isOnlyItem}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        onEndDrag={toggleDragging}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={DraggableItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate={!mapManager.isMaxReached}
      />

      {children}
    </EditorV2>
  );
};

export default Object.assign(Form, { Footer });
