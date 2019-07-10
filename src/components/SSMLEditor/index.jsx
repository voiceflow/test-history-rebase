import 'draft-js-mention-plugin/lib/plugin.css';

import { EditorState, convertFromRaw } from 'draft-js';
// import createSingleLinePlugin from 'draft-js-single-line-plugin';
// import createMentionPlugin, { defaultSuggestionsFilter } from './../../../../../assets/draft-js-mention/lib';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import Editor from 'draft-js-plugins-editor';
import _ from 'lodash';
import React, { Component } from 'react';

import es from './entityStore';
import plugin from './plugin.jsx';

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
        mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
      },
      entityMutability: 'IMMUTABLE',
      mentionTrigger: '{',
      mentionRegExp: '[\\w_-]*',
      mentionPrefix: '{',
      mentionSuffix: '}',
      mentionComponent: (mentionProps) => <span className="variable-block">{mentionProps.children}</span>,
    });

    this.state = {
      editorState: props.content ? EditorState.createWithContent(convertFromRaw(props.content)) : EditorState.createEmpty(),
      suggestions: this.props.variables.map((v) => {
        return { name: v };
      }),
    };
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(
        value,
        this.props.variables.map((v) => {
          return { name: v };
        })
      ),
    });
  };

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [es.first, this.mentionPlugin, plugin, es.last];

    return (
      <div className="editor">
        <Editor
          plugins={plugins}
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder={this.props.placeholder ? this.props.placeholder : 'Enter Text Here'}
          stripPastedStyles={true}
        />
        <MentionSuggestions onSearchChange={this.onSearchChange} suggestions={this.state.suggestions} onAddMention={_.noop} />
        <button onClick={() => plugin.insertEntity('BREAK')}>BREAK</button>
        <button onClick={() => plugin.addEntity('WHISPER')}>WHISPER</button>
        <button onClick={() => plugin.addEntity('SCREAM')}>SCREAM</button>
      </div>
    );
  }
}

export default VariableText;
