import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Input } from 'reactstrap';

import FlowButton from './components/FlowButton';

const TABS = ['structure', 'flows'];

export class Flows extends PureComponent {
  constructor(props) {
    super(props);

    let tab = localStorage.getItem('project_tab');
    if (!tab) tab = 'structure';

    this.state = {
      filter: '',
      tab,
    };

    this.handleChange = this.handleChange.bind(this);
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab(tab) {
    const { tab: stateTab } = this.state;
    if (tab !== stateTab) {
      this.setState(
        {
          tab,
        },
        () => localStorage.setItem('project_tab', tab)
      );
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    const { tab, filter } = this.state;
    const { diagrams, visited, enterFlow, copyFlow, deleteFlow, updateTree, tree } = this.props;
    let flow_tab;
    if (tab === 'structure') {
      const unused = [];
      diagrams.forEach((diagram) => {
        if (!visited.has(diagram.id)) {
          unused.push(
            <FlowButton
              key={diagram.id}
              flow={diagram}
              enterFlow={enterFlow}
              copyFlow={() => copyFlow(diagram.id)}
              deleteFlow={() => deleteFlow(diagram.id, updateTree)}
            />
          );
        }
      });
      flow_tab = (
        <>
          <label className="search-section section-title mt-3">Project Flows</label>
          {tree}
          {unused.length === 0 ? null : (
            <>
              <hr className="mb-2 mt-4" />
              <label className="search-section section-title mt-3">Other Flows</label>
              {unused.map((diagram) => {
                return diagram;
              })}
            </>
          )}
        </>
      );
    } else if (tab === 'flows') {
      flow_tab = (
        <>
          <div className="search-section">
            <label className="section-title mt-3">All Flows</label>
            <Input
              placeholder="Search Flows"
              name="filter"
              value={filter}
              onChange={this.handleChange}
              className="form-control-border mb-3 search-input"
            />
          </div>
          <div className="flows-list">
            {diagrams.map((diagram) => {
              const name = diagram.name === 'ROOT' ? 'HOME' : diagram.name;
              if (filter.trim() && !name.toLowerCase().includes(filter.toLowerCase())) return null;
              return (
                <FlowButton
                  key={diagram.id}
                  flow={diagram}
                  enterFlow={enterFlow}
                  copyFlow={() => copyFlow(diagram.id)}
                  deleteFlow={() => deleteFlow(diagram.id)}
                />
              );
            })}
          </div>
        </>
      );
    }
    return (
      <>
        <div className="search-section">
          <ButtonGroup className="toggle-group w-100">
            {TABS.map((tabIdx) => {
              return (
                <Button key={tabIdx} onClick={() => this.switchTab(tabIdx)} outline={tabIdx !== tab} disabled={tabIdx === tab}>
                  {tabIdx}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
        {flow_tab}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  diagrams: state.diagrams.diagrams,
});
export default connect(mapStateToProps)(Flows);
