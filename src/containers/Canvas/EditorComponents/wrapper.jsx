import Mousetrap from 'mousetrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import * as EditorConstants from './constants';

class EditorWrapper extends PureComponent {
  render() {
    const { unfocus, className, children } = this.props;

    return (
      <div
        id="Editor"
        onFocus={unfocus}
        onMouseDown={unfocus}
        onKeyDown={unfocus}
        onClickCapture={this.eventHandler}
        onKeyDownCapture={this.eventHandler}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={className}
      >
        {children}
      </div>
    );
  }

  onMouseLeave = () => {
    if (!this.props.testing) this.props.diagramEngine.getDiagramModel().setLocked(false);
    this.props.setCanvasEvents();
  };

  onMouseEnter = () => {
    this.props.diagramEngine.getDiagramModel().setLocked();

    Mousetrap.unbind([EditorConstants.CTRL_Z, EditorConstants.CMD_Z]);
    Mousetrap.unbind([EditorConstants.CTRL_Y, EditorConstants.CMD_Y, EditorConstants.CTRL_SHIFT_Z, EditorConstants.CMD_SHIFT_Z]);
    Mousetrap.bind([EditorConstants.CTRL_Z, EditorConstants.CMD_Z], this.props.undo);
    Mousetrap.bind([EditorConstants.CTRL_Y, EditorConstants.CMD_Y, EditorConstants.CTRL_SHIFT_Z, EditorConstants.CMD_SHIFT_Z], this.props.redo);
  };

  eventHandler = (e) => {
    if (this.props.preview) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
}

EditorWrapper.propTypes = {
  preview: PropTypes.bool,
  testing: PropTypes.bool,

  className: PropTypes.string,

  diagramEngine: PropTypes.object,

  undo: PropTypes.func,
  redo: PropTypes.func,
  unfocus: PropTypes.func,
  setCanvasEvents: PropTypes.func,
};

export default EditorWrapper;
