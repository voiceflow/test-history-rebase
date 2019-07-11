import 'draft-js-mention-plugin/lib/plugin.css';
import './ssmlEditor.css';

import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import Editor from 'draft-js-plugins-editor';
import _ from 'lodash';
import React, { Component } from 'react';

import Menu from './Menu';
import Recent from './Recent';
import Speaker from './Speaker';
import Voice from './Voice';
import createEntityStore from './entityStore';
import createTagPlugin from './tagPlugin.jsx';
import { wrapVoice } from './tagUtil';

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

    const { raw, store, voice } = props.content || {};

    this.state = {
      editorState: props.content ? EditorState.createWithContent(convertFromRaw(raw)) : EditorState.createEmpty(),
      suggestions: this.props.variables.map((v) => {
        return { name: v };
      }),
      recent: [],
      voice: voice || 'Alexa',
      text: '',
    };

    this.entityStore = createEntityStore(store);
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

  forwardChange = () => {
    const { editorState, voice, text } = this.state;
    const payload = {
      raw: convertToRaw(editorState.getCurrentContent()),
      store: this.entityStore.exportStore(),
      voice,
      text: wrapVoice(voice, text),
    };
    this.props.onChange && this.props.onChange(payload);
  };

  onChange = (editorState) => {
    this.setState(
      {
        editorState,
        text: editorState
          .getCurrentContent()
          .getBlockMap()
          .map((block) => {
            return block ? block.getText() : '';
          })
          .join(''),
      },
      this.forwardChange
    );
  };

  changeVoice = (voice) => {
    this.setState(
      {
        voice,
      },
      this.forwardChange
    );
  };

  useTag = (data, skip = false) => {
    if (!skip) {
      this.setState((state) => {
        const history = [data, ...state.recent];
        if (history.length > 9) history.pop();
        return {
          recent: history,
        };
      });
    }
    if (data.VF_void) {
      this.tagPlugin.insertEntity(data);
    } else {
      this.tagPlugin.addEntity(data);
    }
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
        <div className="clearfix w-100">
          <Speaker className="float-left" ssml={this.state.text} voice={this.state.voice} />
          <Voice className="float-left" voice={this.state.voice} onChange={this.changeVoice} />
          <Menu className="float-right" onClick={this.useTag} />
          <Recent className="float-right" history={this.state.recent} onClick={this.useTag} />
        </div>
      </div>
    );
  }
}

export default VariableText;
