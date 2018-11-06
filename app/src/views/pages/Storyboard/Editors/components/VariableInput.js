import React, { Component } from 'react';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
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
        if(this.editor){
            // IVE SPENT 2 HOURS ON THIS
            // console.dir(this.editor)
            // this.editor.editor.blur();
            // this.editor.editor.focus();
            // this.editor.editor._handler.onKeyDown(this.editor.editor,{
            //     which: 40,
            //     code: 'ArrowDown',
            //     key: 'ArrowDown',
            //     preventDefault: ()=>{console.log("preventDefault")}
            // });
            // this.editor.editor._handler.onKeyDown(this.editor.editor,{
            //     which: 65,
            //     code: 'KeyA',
            //     key: 'a',
            //     preventDefault: ()=>{console.log("preventDefault")}
            // });
            // this.editor.editor._onKeyDown({
            //     which: 65,
            //     code: 'KeyA',
            //     key: 'a',
            //     preventDefault: ()=>{console.log("preventDefault")}
            // });
            // this.editor.editor.props.handleKeyCommand({
            //     which: 40,
            //     code: 'ArrowDown',
            //     key: 'ArrowDown',
            //     preventDefault: ()=>{console.log("preventDefault")}
            // }, this.state.editorState);
            // this.setState({editorState: this.state.editorState});
            // let currentState = this.state.editorState;
            // var selectionState = this.state.editorState.getSelection();
            // this.setState({editorState: EditorState.forceSelection(currentState, selectionState)});
        }
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
                        ref={(element) => { this.editor = element; }}
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
