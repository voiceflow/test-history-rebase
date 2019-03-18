import React, { Component } from 'react';
import _ from 'lodash'
import { compose, withProps } from 'recompose'
// import createSingleLinePlugin from 'draft-js-single-line-plugin';
// import createMentionPlugin, { defaultSuggestionsFilter } from './../../../../../assets/draft-js-mention/lib';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import './mention.css'

import 'draft-js-mention-plugin/lib/plugin.css';

// const singleLinePlugin = createSingleLinePlugin({
//     stripEntities: false
// });

class VariableText extends Component {

    constructor(props) {
        super(props);
        this.mentionPlugin = createMentionPlugin({
            supportWhitespace: false,
            theme: {
                mentionSuggestions: 'mentionSuggestions',
                mentionSuggestionsEntry: 'mentionSuggestionsEntry',
                mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
                mentionSuggestionsEntryText: 'mentionSuggestionsEntryText'
            },
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

        this.state = {
            editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty(),
            suggestions: _.filter(this.props.variables, v => v !== 'Create Variable').map(v => {return {name: v}})
        };
    }

    componentWillReceiveProps(props) {
        if(props.change !== this.props.change){
            this.setState({
                editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty()
            });
        }
    }

    componentWillUnmount(){
        this.props.updateRaw(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, _.filter(this.props.variables, v=> v !== 'Create Variable').map(v => {return {name: v}})),
        });
    };

    onChange = (editorState) => {
        this.props.updateRaw(convertToRaw(editorState.getCurrentContent()));
        this.setState({
          editorState: editorState
        });
    };

    onAddMention = () => {
        // get the mention object selected
    }

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin];

        return (
            <div className={this.props.className}>
                <Editor
                    plugins={plugins}
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    placeholder={this.props.placeholder ? this.props.placeholder : 'Enter Text Here'}
                    stripPastedStyles={true}
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

export default VariableText;
