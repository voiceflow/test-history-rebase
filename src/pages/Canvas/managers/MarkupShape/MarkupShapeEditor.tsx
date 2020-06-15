import React from 'react';

import { MarkupShapeType } from '@/constants';
import { connect } from '@/hocs';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';

import { ArrowEditor, CircleEditor, LineEditor, RectangleEditor } from './ShapeEditors';
import { EditorProps } from './types';

type MarkupShapeEditorProps = EditorProps<Markup.NodeData.Circle | Markup.NodeData.Rectangle | Markup.NodeData.Arrow | Markup.NodeData.Line>;

export const MarkupShapeEditor: React.FC<MarkupShapeEditorProps> = (props) => {
  let editor;

  switch (props.data.shapeType) {
    case MarkupShapeType.CIRCLE: {
      editor = <CircleEditor {...(props as EditorProps<Markup.NodeData.Circle>)} />;
      break;
    }
    case MarkupShapeType.RECTANGLE: {
      editor = <RectangleEditor {...(props as EditorProps<Markup.NodeData.Rectangle>)} />;
      break;
    }
    case MarkupShapeType.ARROW: {
      editor = <ArrowEditor {...(props as EditorProps<Markup.NodeData.Arrow>)} />;
      break;
    }
    default: {
      editor = <LineEditor {...(props as EditorProps<Markup.NodeData.Line>)} />;
      break;
    }
  }

  return <Content>{editor}</Content>;
};

const mapStateToProps = {};
const mapDispatchToProps = {};

// TODO: connect with the node
export default connect(mapStateToProps, mapDispatchToProps)(MarkupShapeEditor);
