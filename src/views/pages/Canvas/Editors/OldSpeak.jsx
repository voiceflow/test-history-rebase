import React, { Component } from 'react';
// DEPRECATE THIS
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw
} from 'draft-js';

import Select from 'react-select';

import 'draft-js/dist/Draft.css'

// function mediaBlockRenderer(block) {
//   if (block.getType() === 'atomic') {
//     return {
//       component: Media,
//       editable: false,
//     };
//   }

//   return null;
// }

// const Media = (props) => {
//   const entity = props.contentState.getEntity(
//     props.block.getEntityAt(0)
//   );
//   const {value} = entity.getData();
//   const type = entity.getType();

//   let media;
//   if (type === 'VARIABLE') {
//     media = <span className="variable-block">{value}</span>;
//   }

//   return media;
// };

function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'VARIABLE') {
    return 'variable';
  }
}

const variableSpan = (props) => {
    return (
      <span data-offset-key={props.offsetkey} className="variable-block" contentEditable="false">
        &nbsp;{props.decoratedText}&nbsp;
      </span>
    );
};

function getEntityStrategy(mutability) {
    return function(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(
        (character) => {
          const entityKey = character.getEntity();
          if (entityKey === null) {
            return false;
          }
          return contentState.getEntity(entityKey).getMutability() === mutability;
        },
        callback
      );
    };
}

const compositeDecorator = new CompositeDecorator([
    {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: variableSpan
    }
]);

class Speak extends Component {

    constructor(props) {
        super(props);

        let node = this.props.node;
        
        let editorState;
        if(!node.extras.raw){
            editorState = EditorState.createEmpty(compositeDecorator);
        }else{
            editorState = EditorState.createWithContent(convertFromRaw(node.extras.raw), compositeDecorator);
        }

        this.state = {
            editorState: editorState,
            node: node
        };

        this.setDomEditorRef = ref => this.domEditor = ref;

        this.onChange = (editorState) => {
            let node = this.state.node;
            node.extras.raw = convertToRaw(editorState.getCurrentContent());

            this.setState({
                editorState: editorState,
                node: node
            }, this.props.onUpdate);
        };
        this.handleSelection = this.handleSelection.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
    }

    handleKeyCommand(command) {

        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    handleSelection(selected){
        const editorState = this.state.editorState;
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const contentStateWithEntity = contentState.createEntity('VARIABLE', 'IMMUTABLE');
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        
        const textWithEntity = Modifier.insertText(contentStateWithEntity, selection, selected.value, null, entityKey);

        const newEditorState = EditorState.push(editorState, textWithEntity);

        const selection1 = newEditorState.getSelection();

        const nextContentState = newEditorState.getCurrentContent();

        const finalState = Modifier.insertText(nextContentState, selection1, ' ');

        const focus = this.domEditor.focus;

        const lastEditor = EditorState.push(newEditorState, finalState);

        let node = this.state.node;

        node.extras.raw = convertToRaw(lastEditor.getCurrentContent());

        this.setState(
            {
                editorState: lastEditor,
                node: node
            },
            () => { setTimeout(() => focus(), 0) }
        );

        this.props.onUpdate();

        // const editorState = this.state.editorState;
        // const contentState = editorState.getCurrentContent();
        // const contentStateWithEntity = contentState.createEntity(
        //   'VARIABLE',
        //   'IMMUTABLE',
        //   {value: selected.value}
        // );
        // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        // const newEditorState = EditorState.set(
        //   editorState,
        //   {currentContent: contentStateWithEntity}
        // );

        // this.onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
    }

    componentWillUnmount(){
        let node = this.state.node;
        node.extras.raw = convertToRaw(this.state.editorState.getCurrentContent());
        // console.log(node.extras.raw);
    }

    render() {
        return (
            <div>
                <label>Speech</label>
                {this.props.variables.length === 0 ? null : 
                    <Select
                        classNamePrefix="variable-box"
                        placeholder={"Add Variable"}
                        className="variable-box"
                        value={null}
                        onChange={this.handleSelection}
                        options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                            return {label: variable, value: variable}
                        }) : null}
                    />
                }
                <hr/>
                <Editor
                    blockStyleFn={myBlockStyleFn}
                    handleKeyCommand={this.handleKeyCommand}
                    editorState={this.state.editorState} 
                    onChange={this.onChange}
                    placeholder='What would you like Alexa to say...'
                    ref={this.setDomEditorRef}
                />
            </div>
        );
    }
}

export default Speak;