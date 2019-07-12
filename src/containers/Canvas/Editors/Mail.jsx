import { ContentState, convertToRaw } from 'draft-js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Button } from 'reactstrap';

import { selectStyles, variableComponent } from '@/components/VariableSelect/VariableSelect';
import { openTab } from '@/ducks/user';

import VariableInput from './components/VariableInput';

export class Mail extends Component {
  constructor(props) {
    super(props);

    let selected;
    if (props.node.extras.template_id) {
      const find = props.templates.find((t) => t.template_id === props.node.extras.template_id);
      if (find) {
        selected = {
          label: find.title,
          value: find.template_id,
        };

        if (props.node.extras.to && props.node.extras.to.length !== 0) {
          this.updateMapping();
        }
      }
    }

    if (props.node.extras.to && typeof props.node.extras.to === 'string') {
      props.node.extras.to = convertToRaw(ContentState.createFromText(props.node.extras.to));
    }

    this.state = {
      node: props.node,
      selected,
    };

    this.onChange = this.onChange.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.selectVariable = this.selectVariable.bind(this);
  }

  componentDidMount() {
    this.updateMapping();
  }

  updateMapping = () => {
    if (this.props.node.extras.template_id) {
      const find = this.props.templates.find((t) => t.template_id === this.props.node.extras.template_id);
      this.props.node.extras.mapping = find.variables.map((v) => {
        const existing = this.props.node.extras.mapping.find((kv) => kv.key === v);
        let val;
        if (existing) val = existing.val;
        return {
          key: v,
          val,
        };
      });
    }
  };

  onChange(e) {
    const node = this.state.node;
    node.extras[e.target.name] = e.target.value;

    this.setState({
      node,
    });
  }

  selectVariable(selected, index) {
    const node = this.state.node;
    if (!node.extras.mapping[index]) return;
    node.extras.mapping[index].val = selected.value;

    this.setState({
      node,
    });
  }

  selectTemplate(selected) {
    if (selected.template_id === this.state.node.extras.template_id) return;

    const find = this.props.templates.find((t) => t.template_id === selected.value);
    const node = this.state.node;
    node.extras.template_id = find.template_id;

    if (Array.isArray(find.variables) && find.variables.length !== 0) {
      node.extras.mapping = find.variables.map((v) => {
        return {
          val: null,
          key: v,
        };
      });
    } else {
      node.extras.mapping = [];
    }

    this.setState({
      selected,
      node,
    });
  }

  render() {
    if (this.props.templates.length === 0) {
      return (
        <div className="text-center">
          <img className="mb-3 mt-5" src="/images/email_2.svg" alt="user" width="80" />
          <br />
          <span className="text-muted">You currently have no Email Templates</span>
          <Link className="btn btn-secondary mt-3" to={`/tools/${this.props.skill_id}/emails`}>
            Add Templates
          </Link>
        </div>
      );
    }

    const user = this.state.node.extras.to === '_USER';

    return (
      <div>
        <label>Email Template</label>
        <Select
          classNamePrefix="select-box"
          value={this.state.selected}
          onChange={this.selectTemplate}
          placeholder="Select Email Template"
          options={this.props.templates.map((t) => {
            return {
              value: t.template_id,
              label: t.title,
            };
          })}
        />
        <hr />
        <div className="label-btns">
          <label>To</label>
          <Button
            outline={!user}
            disabled={user}
            color="primary"
            onClick={() => {
              const node = this.state.node;
              if (node.extras.to === '_USER') return;
              node.extras.to = '_USER';
              this.setState({ node });
            }}
          >
            User Email
          </Button>
          <Button
            outline={user}
            disabled={!user}
            color="primary"
            onClick={() => {
              const node = this.state.node;
              if (node.extras.to !== '_USER') return;
              node.extras.to = '';
              this.setState({ node });
            }}
          >
            Defined
          </Button>
        </div>
        {!user ? (
          <React.Fragment>
            <VariableInput
              className="form-control"
              raw={this.state.node.extras.to}
              placeholder="E-mail Recipient"
              variables={this.props.variables}
              updateRaw={(raw) => {
                const node = this.state.node;
                node.extras.to = raw;

                this.setState({
                  node,
                });
              }}
            />
          </React.Fragment>
        ) : (
          <span className="text-muted font-italic">This Message Will Only Be Sent If the User Consents to Sharing Their Email</span>
        )}
        <hr />
        <label>Email Variable Map</label>
        <div>
          {this.state.node.extras.mapping.length !== 0 ? (
            <React.Fragment>
              {this.state.node.extras.mapping.map((v, i) => {
                return (
                  <div key={i} className="variable_map mb-2">
                    <Select
                      styles={selectStyles}
                      components={{ Option: variableComponent }}
                      className="map-box"
                      classNamePrefix="variable-box"
                      placeholder="Variable"
                      value={v.val ? { label: `{${v.val}}`, value: v.val } : null}
                      onChange={(select) => this.selectVariable(select, i)}
                      options={
                        Array.isArray(this.props.variables)
                          ? this.props.variables.map((variable) => {
                              return { label: `{${variable}}`, value: variable, openVar: this.props.openVarTab };
                            })
                          : null
                      }
                    />
                    <i className="far fa-arrow-right" />
                    <input readOnly className="map-box form-control" value={`{${v.key}}`} />
                  </div>
                );
              })}
            </React.Fragment>
          ) : (
            <i className="text-muted">No Variables Exist For This Email</i>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  templates: state.emails.email_templates,
});
const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mail);
