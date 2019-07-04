import './Menu.css';

import cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import { showHelp } from '../../ducks/alerts';
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
    this.visited = new Set();
  }

  componentDidMount() {
    const { build } = this.props;
    build(this.updateTree);
  }

  buildTree(node, depth = 0) {
    const { diagrams, enterFlow, copyFlow, preview, deleteFlow } = this.props;

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
            const block = diagrams.find((d) => d.id === diagram_id);

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
            enterFlow={enterFlow}
            copyFlow={() => copyFlow(node.id)}
            preview={preview}
            deleteFlow={() => deleteFlow(node.id)}
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
    const { diagrams } = this.props;
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const diagram of diagrams) {
      if (diagram.name === 'ROOT') {
        this.visited = new Set();
        this.setState({
          tree: this.buildTree(diagram),
          depth: diagrams.length,
        });
      }
    }
  }

  openTab(tab) {
    const { tab: propsTab, open, setTab } = this.props;
    if (tab !== propsTab || !open) {
      localStorage.setItem('tab', tab);
      setTab(tab);
    }
  }

  renderSideBar() {
    const { tab, preview, enterFlow, copyFlow, deleteFlow, user_modules, user, toggleUpgrade, type_counter, history } = this.props;
    const { tree } = this.state;
    switch (tab) {
      case 'variables':
        return <Variables locked={preview} />;
      case 'flows':
        return (
          <Flows
            tree={tree}
            visited={this.visited}
            enterFlow={enterFlow}
            copyFlow={copyFlow}
            deleteFlow={(diagram_id) => {
              deleteFlow(diagram_id);
              this.updateTree();
            }}
          />
        );
      default:
        return <Blocks user_modules={user_modules} user={user} toggleUpgrade={toggleUpgrade} type_counter={type_counter} history={history} />;
    }
  }

  toggleTab = () => {
    const { open, closeTab, openTab } = this.props;
    if (open) {
      closeTab();
    } else {
      openTab('blocks');
    }
  };

  render() {
    const { unfocus, preview, tab, open, openTab, loading_diagram } = this.props;
    return (
      <div className="Menu" onFocus={unfocus} onMouseDown={unfocus} onKeyDown={unfocus}>
        <div id="sidebar" className={cn({ open }, 'canvas-sidebar')} ref={this.sidebar}>
          {!preview && (
            <div className="toolbar">
              <div className="top-down">
                {tabs.top.map((tab, i) => {
                  return (
                    <Tooltip key={i} title={tab.tip} position="right" disabled={tab.tab === tab && open}>
                      <div
                        className={cn('tool', {
                          active: tab.tab === tab && open,
                        })}
                        onClick={() => openTab(tab.tab)}
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
          <div className={cn('sidebar-container', tab)}>
            {loading_diagram ? null : (
              <React.Fragment>
                <div className="sidebar-header">
                  <div className="block-title no-select mb-3">
                    <h5 className="mb-0">{tab}</h5>
                  </div>
                </div>
                <div className="sidebar-content">{this.renderSideBar()}</div>
              </React.Fragment>
            )}
          </div>
        </div>
        <label
          className={cn(`canvas-sidebar-${open ? 'open' : 'closed'}`, 'canvas-sidebar-expand')}
          onClick={() => this.toggleTab()}
          htmlFor="canvas-sidebar"
        />
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
  { showHelp }
)(Menu);
