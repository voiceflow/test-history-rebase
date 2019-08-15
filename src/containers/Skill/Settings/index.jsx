import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';

import { updateDiagramRoot } from '@/ducks/diagram';
import { updateVersion } from '@/ducks/version';

import AdvancedSettings from './Advanced';
import BackupSettings from './Backups';
// SETTING PAGES
import BasicSettings from './Basic';
import DiscoverySettings from './Discovery';

const TABS = ['basic', 'advanced', 'discovery', 'backups'];

class Settings extends Component {
  state = {
    tab: this.props.tag ? this.props.tag : 'basic',
  };

  switchTab = (tab) => {
    if (tab !== this.state.tab) {
      this.setState({ tab });
    }
  };

  modalContent = () => {
    const { skill_id } = this.props;

    if (!skill_id) return null;

    switch (this.state.tab) {
      case 'basic':
        return <BasicSettings {...this.props} />;
      case 'advanced':
        return <AdvancedSettings {...this.props} />;
      case 'discovery':
        return <DiscoverySettings {...this.props} />;
      case 'backups':
        return <BackupSettings {...this.props} onSwapVersions={this.onSwapVersions} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="settings pb-5">
        <div>
          <div className="nav-bar-top mb-4">
            <ButtonGroup className="toggle-group mb-2 toggle-group-settings">
              {TABS.map((tab) => {
                return (
                  <Button
                    key={tab}
                    onClick={() => this.switchTab(tab)}
                    outline={this.state.tab !== tab}
                    disabled={this.state.tab === tab || (this.props.live_mode && tab === 'backups')}
                  >
                    {_.startCase(tab)}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>
        </div>
        <div className="h-100">{this.modalContent()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  load_skill: state.skills.loading,
  error: state.skills.error,
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateSkill: (type, val) => dispatch(updateVersion(type, val)),
    updateDiagramRoot: (val) => dispatch(updateDiagramRoot(val)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
