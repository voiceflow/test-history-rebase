import React, { Component } from 'react';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import 'draft-js-mention-plugin/lib/plugin.css';

const mentionPlugin = createMentionPlugin();
const singleLinePlugin = createSingleLinePlugin();
const plugins = [mentionPlugin];
const { MentionSuggestions } = mentionPlugin;

class VariableInput extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty(),
            suggestions: this.props.variables.map(v => {return {name: v}})
        };
    }

    componentWillUnmount(){
        this.props.updateRaw(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, this.props.variables.map(v => {return {name: v}})),
        });
    };

    onChange = (editorState) => {
        this.props.updateRaw(convertToRaw(editorState.getCurrentContent()));
        this.setState({
          editorState
        });
    };

    onAddMention = () => {
        // get the mention object selected
    }

    render() {
        return (
            <div className="editor">
                <Editor
                    plugins={plugins}
                    editorState={this.state.editorState}
                    onChange={this.onChange}

                />
                <MentionSuggestions
                  onSearchChange={this.onSearchChange}
                  suggestions={this.state.suggestions}
                  onAddMention={this.onAddMention}
                />
            </div>
        );
    }
}

export default VariableInput;
