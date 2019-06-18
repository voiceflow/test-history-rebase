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
    if (tab !== this.state.tab) {
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
    let flow_tab;
    if (this.state.tab === 'structure') {
      const unused = [];
      this.props.diagrams.forEach((diagram) => {
        if (!this.props.visited.has(diagram.id)) {
          unused.push(
            <FlowButton
              key={diagram.id}
              flow={diagram}
              enterFlow={this.props.enterFlow}
              copyFlow={() => this.props.copyFlow(diagram.id)}
              deleteFlow={() => this.props.deleteFlow(diagram.id, this.props.updateTree)}
            />
          );
        }
      });
      flow_tab = (
        <React.Fragment>
          <label className="search-section section-title mt-3">Project Flows</label>
          {this.props.tree}
          {unused.length === 0 ? null : (
            <React.Fragment>
              <hr className="mb-2 mt-4" />
              <label className="search-section section-title mt-3">Other Flows</label>
              {unused.map((diagram) => {
                return diagram;
              })}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    } else if (this.state.tab === 'flows') {
      flow_tab = (
        <React.Fragment>
          <div className="search-section">
            <label className="section-title mt-3">All Flows</label>
            <Input
              placeholder="Search Flows"
              name="filter"
              value={this.state.filter}
              onChange={this.handleChange}
              className="form-control-border mb-3 search-input"
            />
          </div>
          <div className="flows-list">
            {this.props.diagrams.map((diagram) => {
              const name = diagram.name === 'ROOT' ? 'HOME' : diagram.name;
              if (this.state.filter.trim() && !name.toLowerCase().includes(this.state.filter.toLowerCase())) return null;
              return (
                <FlowButton
                  key={diagram.id}
                  flow={diagram}
                  enterFlow={this.props.enterFlow}
                  copyFlow={() => this.props.copyFlow(diagram.id)}
                  deleteFlow={() => this.props.deleteFlow(diagram.id)}
                />
              );
            })}
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <div className="search-section">
          <ButtonGroup className="toggle-group w-100">
            {TABS.map((tab) => {
              return (
                <Button key={tab} onClick={() => this.switchTab(tab)} outline={this.state.tab !== tab} disabled={this.state.tab === tab}>
                  {tab}
                </Button>
              );
            })}
          </ButtonGroup>
        </div>
        {flow_tab}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  diagrams: state.diagrams.diagrams,
});
export default connect(mapStateToProps)(Flows);
