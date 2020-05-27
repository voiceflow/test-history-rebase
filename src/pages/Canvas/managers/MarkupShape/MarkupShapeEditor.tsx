import React from 'react';

import { ShapeType } from '@/constants';
import { connect } from '@/hocs';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';

import { ArrowEditor, CircleEditor, LineEditor, RectangleEditor } from './ShapeEditors';
import { EditorProps } from './types';

type MarkupShapeEditorProps =
  | EditorProps<Markup.CircleShapeNodeData>
  | EditorProps<Markup.RectangleShapeNodeData>
  | EditorProps<Markup.ArrowShapeNodeData>
  | EditorProps<Markup.LineShapeNodeData>;

export const MarkupShapeEditor: React.FC<MarkupShapeEditorProps> = (props) => {
  let editor;

  switch (props.data.shapeType) {
    case ShapeType.CIRCLE: {
      editor = <CircleEditor {...(props as EditorProps<Markup.CircleShapeNodeData>)} />;
      break;
    }
    case ShapeType.RECTANGLE: {
      editor = <RectangleEditor {...(props as EditorProps<Markup.RectangleShapeNodeData>)} />;
      break;
    }
    case ShapeType.ARROW: {
      editor = <ArrowEditor {...(props as EditorProps<Markup.ArrowShapeNodeData>)} />;
      break;
    }
    default: {
      editor = <LineEditor {...(props as EditorProps<Markup.LineShapeNodeData>)} />;
      break;
    }
  }

  return <Content>{editor}</Content>;
};

const mapStateToProps = {};
const mapDispatchToProps = {};

// TODO: connect with the node
export default connect(mapStateToProps, mapDispatchToProps)(MarkupShapeEditor);
