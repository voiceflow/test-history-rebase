import cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import Blocks from './Sidebars/Blocks';
import Flows from './Sidebars/Flows';
import Variables from './Sidebars/Variables';
import FlowButton from './Sidebars/components/FlowButton';

const tabs = {
  top: [
    {
      tab: 'blocks',
      icon: <i className="blocks-icon pl-3 pr-3 pt-3 pb-3 mt-2" />,
      tip: 'Blocks',
    },
    {
      tab: 'flows',
      icon: <i className="flows-icon pl-3 pr-3 pt-3 pb-3 mt-2" />,
      tip: 'Flows',
    },
    {
      tab: 'variables',
      icon: <i className="var-icon pl-3 pr-3 pt-3 pb-3 mt-2" />,
      tip: 'Variables',
    },
  ],
  bottom: [
    {
      link: 'https://forum.voiceflow.com',
      icon: <i className="fas fa-question" />,
      tip: 'Join the Voiceflow Forum for help & updates',
    },
    {
      link: 'https://docs.voiceflow.com/',
      icon: <i className="fas fa-graduation-cap" />,
      tip: 'Access tutorials through Voiceflow University',
    },
    {
      // eslint-disable-next-line no-secrets/no-secrets
      link: 'https://www.facebook.com/groups/199476704186240/',
      icon: <i className="fab fa-facebook-f" />,
      tip: 'Join the Voiceflow Facebook Community',
    },
  ],
};

export class Menu extends Component {
  constructor(props) {
    super(props);

    // DO THIS IN MAPSTATE TO PROPS
    let tab = localStorage.getItem('tab');
    if (!tab) tab = 'blocks';

    this.state = {
      tree: null,
      depth: 0,
    };

    this.buildTree = this.buildTree.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.openTab = this.openTab.bind(this);
    this.renderSideBar = this.renderSideBar.bind(this);
    this.resize = this.resize.bind(this);
    this.visited = new Set();
    this.m_pos = 0;
    this.sidebar = React.createRef();
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (localStorage.getItem('sideWidth') && this.sidebar && nextProps.open) {
      const width = localStorage.getItem('sideWidth');
      this.sidebar.current.style.width = `${width}px`;
      this.sidebar.current.style.transform = `translateX(-${width.slice(0, -2) * 1 + 40}px)`;
    }
  }

  resize(e) {
    const dx = this.m_pos - e.x;
    if (this.sidebar.current.style.width && (e.clientX < 280 || e.clientX > 960)) return;
    this.m_pos = e.x;
    this.sidebar.current.style.width = `${parseInt(getComputedStyle(this.sidebar.current, '').width, 10) - dx}px`;
    localStorage.setItem('sideWidth', `${parseInt(getComputedStyle(this.sidebar.current, '').width, 10) - dx}px`);
  }

  componentDidMount() {
    this.props.build(this.updateTree);
    if (this.sidebar.current) {
      this.sidebar.current.addEventListener(
        'mousedown',
        (e) => {
          if (e.srcElement.classList.contains('open')) {
            this.m_pos = e.x;
            document.addEventListener('mousemove', this.resize, false);
          }
        },
        false
      );
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', this.resize, false);
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.resize, false);
  }

  buildTree(node, depth = 0) {
    if (depth < 5) {
      this.visited.add(node.id);

      let tree;
      let sub_diagrams;
      if (node.sub_diagrams) {
        sub_diagrams = node.sub_diagrams;
      }

      const visited_sub_diagrams = new Set();
      if (Array.isArray(sub_diagrams) && sub_diagrams.length !== 0) {
        tree = sub_diagrams.map((diagram_id, i) => {
          if (!visited_sub_diagrams.has(diagram_id)) {
            visited_sub_diagrams.add(diagram_id);
            const block = this.props.diagrams.find((d) => d.id === diagram_id);

            if (block) {
              return (
                <div className="sub-diagram space-between" key={i}>
                  <div className="sub-column">{this.buildTree(block, depth + 1)}</div>
                </div>
              );
            }
          }
          return null;
        });
      }
      return (
        <React.Fragment>
          <FlowButton
            flow={node}
            depth={depth}
            enterFlow={this.props.enterFlow}
            copyFlow={() => this.props.copyFlow(node.id)}
            preview={this.props.preview}
            deleteFlow={() => this.props.deleteFlow(node.id)}
          />
          {tree}
        </React.Fragment>
      );
    }
    return (
      <div className="diagram-block">
        <div className="diagram-button" style={{ marginLeft: 20 * depth }}>
          ...
        </div>
      </div>
    );
  }

  updateTree() {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const diagram of this.props.diagrams) {
      if (diagram.name === 'ROOT') {
        this.visited = new Set();
        this.setState({
          tree: this.buildTree(diagram),
          depth: this.props.diagrams.length,
        });
      }
    }
  }

  openTab(tab) {
    if (tab !== this.props.tab || !this.props.open) {
      localStorage.setItem('tab', tab);
      this.props.setTab(tab);
    }
  }

  renderSideBar() {
    switch (this.props.tab) {
      case 'variables':
        return <Variables locked={this.props.preview} />;
      case 'flows':
        return (
          <Flows
            tree={this.state.tree}
            visited={this.visited}
            enterFlow={this.props.enterFlow}
            copyFlow={this.props.copyFlow}
            deleteFlow={(diagram_id) => {
              this.props.deleteFlow(diagram_id);
              this.updateTree();
            }}
          />
        );
      default:
        return (
          <Blocks
            user_modules={this.props.user_modules}
            user={this.props.user}
            toggleUpgrade={this.props.toggleUpgrade}
            type_counter={this.props.type_counter}
            history={this.props.history}
          />
        );
    }
  }

  render() {
    return (
      <div className="Menu" onFocus={this.props.unfocus} onMouseDown={this.props.unfocus} onKeyDown={this.props.unfocus}>
        {!this.props.preview && this.props.isCanvas && (
          <div className="toolbar">
            <div className="top-down">
              {tabs.top.map((tab, i) => {
                return (
                  <Tooltip key={i} title={tab.tip} position="right" disabled={tab.tab === this.props.tab && this.props.open}>
                    <div
                      className={cn('tool', {
                        active: tab.tab === this.props.tab && this.props.open,
                      })}
                      onClick={() => this.props.openTab(tab.tab)}
                    >
                      {tab.icon}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
            <div className="spacer" />
            <div className="bottom-up">
              {tabs.bottom.map((tab, i) => {
                return (
                  <Tooltip key={i} title={tab.tip} position="right">
                    <a className="tool no-underline" href={tab.link} target="_blank" rel="noopener noreferrer">
                      {tab.icon}
                    </a>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        )}
        <div id="sidebar" className={cn({ open: this.props.open })} ref={this.sidebar}>
          <div className={cn('sidebar-container', this.props.tab)}>
            {this.props.loading_diagram ? null : (
              <React.Fragment>
                <div className="sidebar-header">
                  <div
                    className="block-title no-select mb-3"
                    onClick={() => {
                      localStorage.setItem('sideWidth', this.sidebar.current.style.width);
                      this.props.closeTab();
                    }}
                  >
                    <h5 className="mb-0">{this.props.tab}</h5>
                    <div className="close pl-3 py-3" />
                  </div>
                </div>
                <div className="sidebar-content">{this.renderSideBar()}</div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    diagrams: state.diagrams.diagrams,
  };
};

export default connect(
  mapStateToProps,
  null
)(Menu);
