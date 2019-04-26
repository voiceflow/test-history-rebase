import React, { Component } from "react";
import AceEditor from "react-ace";

class Code extends Component {
  constructor(props) {
    super(props);

    if (!props.node.extras.code) {
      props.node.extras.code = "";
    }
    this.state = {
      code: props.node.extras.code || '',
      node: props.node
    };

    this.updateContent = this.updateContent.bind(this);
  }

  componentDidMount() {
    const that = this;
    this.refs.aceEditor.editor.completers.push({
      getCompletions: function(editor, session, pos, prefix, callback) {
        var wordList = that.props.variables;
        callback(
          null,
          wordList.map(function(word) {
            return {
              caption: word,
              value: word,
              meta: "variable"
            };
          })
        );
      }
    });
  }

  updateContent(content) {
    this.setState({
      code: content
    })
    this.props.node.extras.code = content
  }

  render() {
    return (
      <div>
        <AceEditor
          ref="aceEditor"
          name="code"
          className="editor w-100"
          mode="javascript"
          onChange={this.updateContent}
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={this.state.code}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false
          }}
        />
      </div>
    );
  }
}

export default Code;
