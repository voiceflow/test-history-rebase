import cn from 'classnames';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import React from 'react';

import { draftJSContentAdapter } from '@/client/adapters/draft';
import DraftJSEditor from '@/components/DraftJSEditor';
import { InlineVariableTag } from '@/componentsV2/VariableTag';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';
import { swallowEvent } from '@/utils/dom';
import { noop } from '@/utils/functional';

import Container from './components/VariableTextContainer';
import Field from './components/VariableTextField';

export { Container as VariableTextContainer };
export { Field as VariableTextField };

class VariableText extends React.PureComponent {
  mentionPlugin = createMentionPlugin({
    theme: {
      mentionSuggestions: cn('mentionSuggestions', this.props.suggestionsClassName),
      mentionSuggestionsEntry: 'mentionSuggestionsEntry',
      mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
      mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
    },
    supportWhitespace: false,
    entityMutability: 'IMMUTABLE',
    mentionTrigger: '{',
    mentionRegExp: '[\\w_-]*',
    mentionPrefix: '{',
    mentionSuffix: '}',
    mentionComponent: ({ children }) => <InlineVariableTag>{children}</InlineVariableTag>,
  });

  state = {
    editorState: this.props.value
      ? EditorState.createWithContent(convertFromRaw(draftJSContentAdapter.toDB(this.props.value)))
      : EditorState.createEmpty(),
    suggestions: this.props.variables.map((name) => ({ name })),
  };

  editorRef = React.createRef();

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    if (props.change !== this.props.change) {
      this.setState({
        editorState: props.value ? EditorState.createWithContent(convertFromRaw(draftJSContentAdapter.toDB(props.value))) : EditorState.createEmpty(),
      });
    }
  }

  onSearchChange = ({ value }) =>
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.props.variables.map((name) => ({ name }))),
    });

  focusEditor = () => this.editorRef.current.focus();

  onBlur = () => {
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());

    this.props.onChange(draftJSContentAdapter.fromDB(raw));
  };

  onChange = (editorState) => {
    this.setState({ editorState });
    if (this.props.notLazy) {
      const raw = convertToRaw(editorState.getCurrentContent());
      this.props.onChange(draftJSContentAdapter.fromDB(raw));
    }
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const {
      onFocus,
      placeholder,
      disableDrop,
      plugins = [],
      className,
      mentionClassName,
      onAddMention = noop,
      value,
      change,
      onChange,
      variables,
      suggestionsClassName,
      invalidValue,
      ...props
    } = this.props;
    const { suggestions, editorState } = this.state;

    return (
      <Container>
        <Field className={className} onDragStart={swallowEvent()} onClick={this.focusEditor} error={invalidValue}>
          <DraftJSEditor
            plugins={[this.mentionPlugin, ...plugins]}
            editorState={editorState}
            placeholder={placeholder || 'Enter Text Here'}
            stripPastedStyles
            onFocus={onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
            handleDrop={() => disableDrop && 'handled'}
            ref={this.editorRef}
            {...props}
          />
        </Field>
        <MentionSuggestions onSearchChange={this.onSearchChange} suggestions={suggestions} onAddMention={onAddMention} className={mentionClassName} />
      </Container>
    );
  }
}

const mapStateToProps = {
  variables: allVariablesSelector,
};

export default connect(mapStateToProps)(VariableText);
