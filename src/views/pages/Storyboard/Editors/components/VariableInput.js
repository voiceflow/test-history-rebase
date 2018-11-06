import React, { Component } from 'react';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import { EditorState, convertFromRaw, convertToRaw, SelectionState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import 'draft-js-mention-plugin/lib/plugin.css';

class VariableInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty(),
            suggestions: this.props.variables.map(v => {return {name: v}})
        };

        this.mentionPlugin = createMentionPlugin({
            supportWhitespace: false,
            entityMutability: 'IMMUTABLE',
            mentionTrigger: '{',
            mentionRegExp: '[\\w_-]*',
            mentionPrefix: '{',
            mentionSuffix: '}',
            mentionComponent: (mentionProps) => (
                <span className='variable-block'>
                  {mentionProps.children}
                </span>
            )
        });

        this.singleLinePlugin = createSingleLinePlugin({
            stripEntities: false
        });

        this.onAddMention = this.onAddMention.bind(this);
    }

    // componentWillUnmount(){
        // this.props.updateRaw(convertToRaw(this.state.editorState.getCurrentContent()));
    // }

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, this.props.variables.map(v => {return {name: v}})),
        });
    };

    onChange = (editorState) => {
        this.props.updateRaw(convertToRaw(editorState.getCurrentContent()));
        this.setState({
          editorState: editorState
        });
    };

    onAddMention = () => {
        // if(!this.editor) return;

        setTimeout(() => {

            // console.log(window.emit('keydown', {keyCode: 40}));

            // let e = document.createEvent('KeyboardEvent');
            // e.initKeyEvent("keydown",       // typeArg,                                                           
            //     true,             // canBubbleArg,                                                        
            //     true,             // cancelableArg,                                                       
            //     null,             // viewArg,  Specifies UIEvent.view. This value may be null.     
            //     false,            // ctrlKeyArg,                                                               
            //     false,            // altKeyArg,                                                        
            //     false,            // shiftKeyArg,                                                      
            //     false,            // metaKeyArg,                                                       
            //     40,               // keyCodeArg,                                                      
            // 0);              // charCodeArg);

            // let e = new Event('keydown', {
            //     bubbles: true,
            //     which: 40,
            //     code: 'ArrowDown',
            //     key: 'ArrowDown'
            // });

            // let e2 = new Event('selectionchange');

            // console.log(document.activeElement);
            var textEvent = document.createEvent('TextEvent');
            textEvent.initTextEvent ('textInput', true, true, null, 'yeet');                    
            document.activeElement.dispatchEvent(textEvent);

            // document.activeElement.dispatchInteractiveEvent(e);

            // document.activeElement.dispatchEvent(e2);

            // console.log(e);

            // console.dir(this.editor);

            // this.editor.editor.editorContainer.dispatchEvent(e);
            // this.editor.editor.editor.dispatchEvent(e);

            // this.editor.editor._handler.onKeyDown(this.editor.editor, e);
            // this.editor.editor._onKeyDown(e);
            // this.editor.editor._onKeyPress(e);

            // const editorState = this.state.editorState;
            // const contentState = editorState.getCurrentContent();
            // const selectionState = editorState.getSelection();
            // const anchorKey = selectionState.getStartKey();
            // const offSet = selectionState.getStartOffset();

            // const selection = editorState.getSelection();
            // const text = Modifier.insertText(contentState, selection, ' ');
            // const es = EditorState.push(editorState, text, 'insert-fragment');
            // this.setState({
            //     editorState: EditorState.acceptSelection(
            //         editorState,
            //         new SelectionState({
            //             anchorKey: currentContentBlock.getKey(),
            //             anchorOffset: 0,
            //             focusKey: currentContentBlock.getKey(),
            //             focusOffset: 0,
            //             isBackward: false
            //         })
            //     )
            // });

            // const afterSelectionMove = EditorState.acceptSelection(
            //     editorState,
            //     new SelectionState({
            //         anchorKey: anchorKey,
            //         anchorOffset: offSet,
            //         focusKey: anchorKey,
            //         focusOffset: offSet,
            //         isBackward: false
            //     })
            // )

            // const final = EditorState.forceSelection(
            //     afterSelectionMove,
            //     afterSelectionMove.getSelection()
            // )

            // this.setState({
            //     editorState: final
            // });

        }, 0);
    }

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin, this.singleLinePlugin];

        return (
            <React.Fragment>
                <div className={`variable-input-field ${this.props.className}`}>
                    <Editor
                        plugins={plugins}
                        editorState={this.state.editorState}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder}
                        blockRenderMap={this.singleLinePlugin.blockRenderMap}
                    />
                </div>
                <MentionSuggestions
                  onSearchChange={this.onSearchChange}
                  suggestions={this.state.suggestions}
                  onAddMention={this.onAddMention}
                />
            </React.Fragment>
        );
    }
}

export default VariableInput;
