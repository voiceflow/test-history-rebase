import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions, Entity, NoMatchV2, NoReplyV2 } from '../../components';
import type { NodeEditorV2 } from '../../types';
import Buttons from './Buttons';
import Root from './Root';

const CarouselEditor: NodeEditorV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = () => (
  <EditorV2.Route component={Root}>
    <EditorV2.Route path={NoMatchV2.PATH} component={NoMatchV2.Editor} />
    <EditorV2.Route path={NoReplyV2.PATH} component={NoReplyV2.Editor} />

    {/* TODO: move Entity.PATH and Actions.PATH into Buttons.Editor similar to NoMatchV2.Editor */}
    <EditorV2.Route path={Buttons.PATH} component={Buttons.Editor}>
      <EditorV2.Route path={Entity.PATH} component={Entity.Editor} />
      <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    </EditorV2.Route>
  </EditorV2.Route>
);

export default CarouselEditor;
