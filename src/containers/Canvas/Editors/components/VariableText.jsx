import './mention.css';
import 'draft-js-mention-plugin/lib/plugin.css';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
// import createSingleLinePlugin from 'draft-js-single-line-plugin';
// import createMentionPlugin, { defaultSuggestionsFilter } from './../../../../../assets/draft-js-mention/lib';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import Editor from 'draft-js-plugins-editor';
import _ from 'lodash';
import React from 'react';

class VariableText extends React.Component {
  mentionPlugin = createMentionPlugin({
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

  editorRef = React.createRef();

  state = {
    editorState: this.props.raw ? EditorState.createWithContent(convertFromRaw(this.props.raw)) : EditorState.createEmpty(),
    suggestions: _.filter(this.props.variables, (v) => v !== 'Create Variable').map((v) => {
      return { name: v };
    }),
  };

  focus() {
    this.editorRef.current.focus();
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    if (props.change !== this.props.change) {
      this.setState({
        editorState: props.raw ? EditorState.createWithContent(convertFromRaw(props.raw)) : EditorState.createEmpty(),
      });
    }
  }

  componentWillUnmount() {
    if (this.props.silent) {
      return;
    }

    const raw = convertToRaw(this.state.editorState.getCurrentContent());
    raw.text = this.state.editorState.getCurrentContent().getPlainText();

    this.props.updateRaw(raw);
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(
        value,
        this.props.variables.filter((variable) => variable !== 'Create Variable').map((name) => ({ name }))
      ),
    });
  };

  onChange = (editorState) => {
    const raw = convertToRaw(editorState.getCurrentContent());

    raw.text = editorState.getCurrentContent().getPlainText();

    this.props.updateRaw(raw);
    this.setState({ editorState });
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    return (
      <div
        className={this.props.className}
        draggable
        onDragStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Editor
          plugins={plugins}
          editorState={this.state.editorState}
          onChange={this.onChange}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          placeholder={this.props.placeholder || 'Enter Text Here'}
          stripPastedStyles={true}
          ref={this.editorRef}
        />
        <MentionSuggestions onSearchChange={this.onSearchChange} suggestions={this.state.suggestions} onAddMention={_.noop} />
      </div>
    );
  }
}

export default VariableText;
