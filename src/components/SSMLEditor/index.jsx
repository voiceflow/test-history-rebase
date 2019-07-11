import 'draft-js-mention-plugin/lib/plugin.css';
import './ssmlEditor.css';

import { EditorState, convertFromRaw } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import Editor from 'draft-js-plugins-editor';
import _ from 'lodash';
import React, { Component } from 'react';

import Menu from './Menu';
import createEntityStore from './entityStore';
import createTagPlugin from './tagPlugin.jsx';

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

    this.entityStore = createEntityStore();
    this.tagPlugin = createTagPlugin(this.entityStore);
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
    const plugins = [this.entityStore.first, this.mentionPlugin, this.tagPlugin, this.entityStore.last];

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
        <hr />
        <div>
          <button onClick={() => this.tagPlugin.insertEntity('BREAK')}>BREAK</button>
          <button onClick={() => this.tagPlugin.addEntity('WHISPER')}>WHISPER</button>
          <button onClick={() => this.tagPlugin.addEntity('SCREAM')}>SCREAM</button>
          <Menu />
        </div>
      </div>
    );
  }
}

export default VariableText;
