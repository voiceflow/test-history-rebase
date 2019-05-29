import React, { Component } from 'react';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import 'draft-js-mention-plugin/lib/plugin.css';
import _ from 'lodash'

class VariableInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty(),
            suggestions: _.filter(this.props.variables, v => v !== 'Create Variable').map(v => {return {name: v}})
        };

        this.mentionPlugin = createMentionPlugin({
            theme: {
                mentionSuggestions: 'mentionSuggestions',
                mentionSuggestionsEntry: 'mentionSuggestionsEntry',
                mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
                mentionSuggestionsEntryText: 'mentionSuggestionsEntryText'
            },
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

        // document.onkeydown = function(e) { console.log("Keypress changed!", e); };
        // document.onselectionchange = function(e) { console.log("selection change!", e); };

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
            suggestions: defaultSuggestionsFilter(value, _.filter(this.props.variables, v=> v !== 'Create Variable').map(v => {return {name: v}})),
        });
    };

    onChange = (editorState) => {
        const raw = convertToRaw(editorState.getCurrentContent())
        raw.text = editorState.getCurrentContent().getPlainText();
        this.props.updateRaw(raw);
        this.setState({
          editorState: editorState
        });
    };

    onAddMention = (e) => {
        // if(!this.editor) return;

        setTimeout(() => {
            if(!document.activeElement) return;

            let scroller = document.activeElement.getElementsByClassName("public-DraftStyleDefault-block")[0];

            // let width = 0;
            // let elementWidth = scroller.offsetWidth;

            // scroller.childNodes.forEach(node => {
            //     width += node.offsetWidth;
            // })

            let scrollDistance = (e.name.length + 2) * 9;

            scroller.scrollLeft += scrollDistance;
            // if((width - (elementWidth + scroller.scrollLeft)) < scrollDistance){
            //     scroller.scrollLeft += scrollDistance;
            // }

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
                        stripPastedStyles={true}
                        onBlur={() => { if(this.props.onBlur) this.props.onBlur()}}
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
