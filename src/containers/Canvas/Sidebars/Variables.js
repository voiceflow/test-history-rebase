import { setError } from 'ducks/modal';
import { pushVariable, setVariables } from 'ducks/variable';
import { updateVersion } from 'ducks/version';
import isVarName from 'is-var-name';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { FormGroup, Input, Label } from 'reactstrap';

export const defaultVariables = {
  sessions: 'The Number of times a particular user has opened the app',
  user_id: "The user's Amazon/Google unique id",
  timestamp: 'UNIX timestamp (number of seconds since January 1st, 1970 at UTC.)',
  platform: 'The platform your skill is running on ("alexa" or "google")',
  locale: 'The locale of the user (eg en-US, en-CA, it-IT, fr-FR ...)',
};

const tt = (width, message) => <div style={{ width }}>{message}</div>;

export class Variables extends PureComponent {
  constructor(props) {
    super(props);

    let tab = localStorage.getItem('variable_tab');
    if (!tab) tab = 'global';

    this.state = {
      tab,
      new_var: '',
      new_global: '',
    };

    this.addVariable = this.addVariable.bind(this);
    this.addGlobalVariable = this.addGlobalVariable.bind(this);
    this.deleteVariable = this.deleteVariable.bind(this);
    this.deleteGlobalVariable = this.deleteGlobalVariable.bind(this);
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
        () => localStorage.setItem('variable_tab', tab)
      );
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  addVariable(e) {
    const { variables, global_variables, addVariable } = this.props;
    const { new_var } = this.state;
    if (e) e.preventDefault();
    if (isVarName(new_var) && !variables.includes(new_var) && !new_var.startsWith('_') && !global_variables.includes(new_var)) {
      addVariable(new_var);
      this.setState({
        new_var: '',
      });
    } else {
      alert('Invalid Variable: Variables must start with a character and can not contain spaces or special characters or begin with an underscore.');
    }
    return false;
  }

  addGlobalVariable(e) {
    const { global_variables, updateSkill, setError, variables: propVariables } = this.props;
    const { new_global } = this.state;
    if (e) e.preventDefault();
    const variables = global_variables;
    const new_var = new_global;
    if (isVarName(new_var) && !variables.includes(new_var) && !new_var.startsWith('_') && !propVariables.includes(new_var)) {
      variables.push(new_var);
      updateSkill('globals', variables);
      this.setState({
        new_global: '',
      });
    } else {
      setError(
        "Invalid Variable: Variables can't have the same name and must start with a character and can not contain spaces or special characters or begin with an underscore."
      );
    }
    return false;
  }

  deleteVariable(variable) {
    const { variables, setVariables } = this.props;
    const index = variables.indexOf(variable);
    if (index !== -1) variables.splice(index, 1);
    setVariables(variables);
    this.forceUpdate();
  }

  deleteGlobalVariable(variable) {
    const { global_variables, updateSkill } = this.props;
    const variables = global_variables;
    const index = variables.indexOf(variable);
    if (index !== -1) variables.splice(index, 1);
    updateSkill('globals', variables);
    this.forceUpdate();
  }

  render() {
    const { locked, variables, global_variables } = this.props;
    const { tab, new_global, new_var } = this.state;
    return (
      <React.Fragment>
        {tab !== 'local' ? (
          <>
            <form id="variable-submit" onSubmit={this.addGlobalVariable}>
              <FormGroup className="mb-0 text-center">
                <Label className="mt-2 text-left">
                  Create Variable{' '}
                  <Tooltip position="bottom" html={tt(180, 'Project Variables can be used anywhere in the project and save across sessions')}>
                    <span onClick={() => this.setState({ tab: 'local' })} className="pointer">
                      (Project)
                    </span>
                  </Tooltip>
                </Label>
                <div className="variable-box">
                  <Input
                    readOnly={locked}
                    name="new_global"
                    value={new_global}
                    onChange={this.handleChange}
                    maxLength="16"
                    placeholder="Variable Name"
                  />
                </div>
              </FormGroup>
            </form>
            <small className="text-muted mb-4 pt-2 d-block">
              Press <b>'Enter'</b> to add variable
            </small>
          </>
        ) : (
          <>
            <form id="variable-submit" onSubmit={this.addVariable}>
              <FormGroup className="mb-0 text-center">
                <Label className="mt-2 text-left">
                  Create Variable{' '}
                  <Tooltip position="bottom" html={tt(180, 'Flow Variables exist only in this flow and are reset after you leave the flow')}>
                    <span onClick={() => this.setState({ tab: 'global' })} className="pointer">
                      (Flow)
                    </span>
                  </Tooltip>
                </Label>
                <div className="variable-box">
                  <Input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    readOnly={locked}
                    name="new_var"
                    value={new_var}
                    onChange={this.handleChange}
                    maxLength="16"
                    placeholder="Flow Variable Name"
                  />
                </div>
              </FormGroup>
            </form>
            <small className="text-muted mb-4 pt-2 d-block">
              Press <b>'Enter'</b> to add flow variable
            </small>
          </>
        )}
        <hr />
        <div>
          {variables.length > 0 && (
            <div className="mb-4">
              <Label>Flow Variables</Label>
              <div className="variables">
                {variables.map((variable, i) => {
                  return (
                    <div key={variable} className="variable_tag">
                      {`{${variable}}`}{' '}
                      <span onClick={() => this.deleteVariable(variable)}>
                        <i className="fas fa-times" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Label>Project Variables</Label>
          <div className="variables">
            {global_variables.map((variable, i) => {
              if (variable in defaultVariables) {
                return (
                  <Tooltip key={variable} position="bottom" html={<div style={{ width: 165 }}>{defaultVariables[variable]}</div>}>
                    <div className="variable_tag global default">{`{${variable}}`}</div>
                  </Tooltip>
                );
              }
              return (
                <div key={variable} className="variable_tag global">
                  {`{${variable}}`}{' '}
                  <span onClick={() => this.deleteGlobalVariable(variable)}>
                    <i className="fas fa-times" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  global_variables: state.skills.skill.global,
  variables: state.variables.localVariables,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addVariable: (variable) => dispatch(pushVariable(variable)),
    setVariables: (variables) => dispatch(setVariables(variables)),
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Variables);
