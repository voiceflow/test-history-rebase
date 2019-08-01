import './NavBar.css';

import axios from 'axios';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Toggle from 'react-toggle';

import { FullSpinner } from '@/components/Spinner';
import SvgIcon from '@/components/SvgIcon';
import { fetchDiagrams, updateDiagramRoot } from '@/ducks/diagram';
import { setLiveModeModal, toggleLive } from '@/ducks/version';
import LogsIcon from '@/svgs/logs.svg';

import { LiveToggleText, LiveToggleWrapper, NavBarTabs, NavRightGroup } from './styled';

const PAGES = ['canvas', 'test', 'publish', 'analytics'];

export class SecondaryNavBar extends Component {
  state = {
    loading: false,
  };

  toggleLiveMode() {
    if (this.props.live_mode) {
      this.props.updateDiagramRoot(this.props.dev_skill.diagram);
      this.props.fetchDiagrams(this.props.dev_skill.skill_id);
      this.props.setLiveModal(false);
      this.props.toggleLive(this.props.dev_skill, this.props.dev_skill.diagram, this.props.skill_id, false).then(() => {
        this.setState({
          loading: false,
        });
        this.props.history.push(`/canvas/${this.props.dev_skill.skill_id}/${this.props.dev_skill.diagram}`);
      });
    } else {
      axios
        .get(`/skill/${this.props.live_version}`)
        .then((res) => {
          this.props.updateDiagramRoot(res.data.diagram);
          this.props.fetchDiagrams(res.data.skill_id);
          this.props.setLiveModal(true);
          this.props.toggleLive(res.data, res.data.diagram, res.data.skill_id, true).then(() => {
            this.setState({
              loading: false,
            });
            this.props.history.push(`/canvas/${res.data.skill_id}/${res.data.diagram}`);
          });
        })
        .catch((err) => {
          console.error(err);
          alert('Unable to fetch live version');
        });
    }
  }

  renderItem(page) {
    if (page === 'publish' && this.props.live_mode) {
      return (
        <Link to="" key={page} className="nav-item live-mode-disabled" onClick={(e) => e.preventDefault()}>
          {page}
        </Link>
      );
    }
    if (page === this.props.page) {
      return (
        <div key={page} className="nav-item active">
          {page}
        </div>
      );
    }
    if (this.props.skill_id) {
      let suffix = '';
      if (page === 'publish') {
        suffix = this.props.platform === 'alexa' ? '' : this.props.platform;
      } else if (page === 'analytics') {
        if (this.props.live_mode) {
          return (
            <Link to={`/tools/${this.props.skill_id}`} key={page} className="nav-item">
              {page}
            </Link>
          );
        }
        return null;
      }
      return (
        <Link to={`/${page}/${this.props.skill_id}/${suffix}`} key={page} className="nav-item">
          {page}
        </Link>
      );
    }
    return (
      <div key={page} className="nav-item">
        {page}
      </div>
    );
  }

  render() {
    const { amzn_id, live_version, live_mode, page, skill_id } = this.props;

    return (
      <>
        <div id="secondary-nav">
          <NavBarTabs>{PAGES.map((page) => this.renderItem(page))}</NavBarTabs>
          <NavRightGroup>
            {amzn_id && (
              <>
                {live_version ? (
                  <LiveToggleWrapper>
                    {live_mode ? <LiveToggleText>Live</LiveToggleText> : <LiveToggleText>Development</LiveToggleText>}
                    <Toggle
                      checked={live_mode}
                      icons={false}
                      onChange={() => {
                        this.setState({ loading: true });
                        this.toggleLiveMode();
                      }}
                      disabled={page !== 'canvas' || this.state.loading}
                    />
                  </LiveToggleWrapper>
                ) : null}
                {page === 'logs' ? (
                  <div className="log-icon">
                    <SvgIcon icon={LogsIcon} />
                  </div>
                ) : (
                  <Link to={`/creator_logs/${skill_id}`} className="log-icon">
                    <SvgIcon icon={LogsIcon} />
                  </Link>
                )}
              </>
            )}
          </NavRightGroup>
        </div>
        {this.state.loading && <FullSpinner name="Version" />}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
  skill_id: state.skills.skill.skill_id,
  amzn_id: state.skills.skill.amzn_id,
  live_mode: state.skills.live_mode,
  live_version: state.skills.live_version,
  dev_skill: state.skills.dev_skill ? state.skills.dev_skill : state.skills.skill,
});

const mapDispatchToProps = {
  toggleLive,
  updateDiagramRoot,
  fetchDiagrams,
  setLiveModal: setLiveModeModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondaryNavBar);
