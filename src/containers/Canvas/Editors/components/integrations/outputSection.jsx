import update from 'immutability-helper';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { openTab } from '@/ducks/user';

import OutputMapping from './outputMapping';

// props
// action_data, mapping_options, loading, variables, toggleSection, open, showNextSection
class OutputSection extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.checkCompletion = this.checkCompletion.bind(this);

    this.handleAddMap = this.handleAddMap.bind(this);
    this.handleRemoveMap = this.handleRemoveMap.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentDidMount() {
    const { action_data, updateActionData } = this.props;
    if (!action_data.mapping) {
      updateActionData({
        mapping: [],
      });
    }
    this.checkCompletion();
  }

  checkCompletion() {
    const { action_data } = this.props;
    const { completed: stateCompleted } = this.state;
    const mapping = action_data.mapping;
    let completed = false;
    if (mapping && mapping.length > 0 && _.find(mapping, (v) => !_.isNil(v.arg1) && !_.isNil(v.arg2))) {
      completed = true;
    }

    if (completed !== stateCompleted) {
      this.setState({
        completed,
      });
    }
  }

  handleAddMap() {
    const { action_data, updateActionData } = this.props;

    updateActionData({
      mapping: update(action_data.mapping, {
        $push: [
          {
            arg1: null,
            arg2: null,
          },
        ],
      }),
    });
  }

  handleRemoveMap(i) {
    const { action_data, updateActionData } = this.props;

    updateActionData(
      {
        mapping: update(action_data.mapping, {
          $splice: [[i, 1]],
        }),
      },
      this.checkCompletion
    );
  }

  handleSelection(i, arg, value) {
    const { action_data, updateActionData, openVarTab } = this.props;

    if (value !== 'Create Variable') {
      updateActionData(
        {
          mapping: update(action_data.mapping, {
            [i]: {
              [arg]: {
                $set: value,
              },
            },
          }),
        },
        this.checkCompletion
      );
    } else {
      localStorage.setItem('tab', 'variables');
      openVarTab('variables');
    }
  }

  render() {
    const { toggleSection, open, mapping_options, action_data, variables, loading, showNextSection } = this.props;
    const { completed } = this.state;
    return (
      <>
        <div className="d-flex flex-column section-title-container" onClick={() => toggleSection()}>
          <div className="integrations-section-title text-muted">
            Mapping output
            {completed && <div className="completed-badge">&nbsp;&nbsp;&nbsp;&nbsp;</div>}
          </div>
        </div>
        <Collapse isOpen={open} className="w-100 mb-4">
          {mapping_options && action_data.mapping && !loading && (
            <OutputMapping
              arg1_options={[
                {
                  value: 'row_number',
                  label: 'Row Number',
                },
              ].concat(mapping_options)}
              arg2_options={variables}
              arguments={action_data.mapping}
              onAdd={() => this.handleAddMap()}
              onRemove={this.handleRemoveMap}
              handleSelection={(i, arg, value) => this.handleSelection(i, arg, value)}
            />
          )}
          {loading && <Spinner isEmpty />}
          <div className="text-center mt-3">
            <Button isPrimary disabled={!completed} onClick={showNextSection}>
              Next
            </Button>
          </div>
        </Collapse>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openVarTab: (tab) => dispatch(openTab(tab)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OutputSection);
