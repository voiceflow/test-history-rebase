import './Admin.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ButtonGroup } from 'reactstrap';

import Header from '@/components/Header';
import { fetchTeams } from '@/ducks/team';

import Copy from './Copy';
import FinanceBoard from './FinanceBoard';
import Home from './Home';
import ProductUpdates from './ProductUpdates';
import SkillLookup from './SkillLookup';
import Template from './Template';
import Vendors from './Vendors';

const tabs = [
  {
    display: (
      <>
        <i className="fal fa-home" /> Home
      </>
    ),
    match: ['default'],
    link: '/admin',
  },
  {
    display: (
      <>
        <i className="fal fa-money-bill-wave" /> Finance
      </>
    ),
    match: ['charges'],
    link: '/admin/charges',
  },
  {
    display: (
      <>
        <i className="fal fa-store-alt" /> Vendors
      </>
    ),
    match: ['vendors'],
    link: '/admin/vendors',
  },
  {
    display: (
      <>
        <i className="fal fa-search" /> Skill Lookup
      </>
    ),
    match: ['lookup'],
    link: '/admin/lookup',
  },
  {
    display: (
      <>
        <i className="fal fa-copy" /> Copy
      </>
    ),
    match: ['copy'],
    link: '/admin/copy',
  },
  {
    display: (
      <>
        <i className="fal fa-ruler-combined" /> Templates
      </>
    ),
    match: ['template'],
    link: '/admin/template',
  },
  {
    display: (
      <>
        <i className="fal fa-scroll" /> Product Updates
      </>
    ),
    match: ['updates'],
    link: '/admin/updates',
  },
];

class Admin extends Component {
  componentDidMount() {
    if (this.props.teams.allIds.length === 0) {
      this.props.fetchTeams();
    }
  }

  render() {
    let page;
    switch (this.props.page) {
      case 'updates':
        page = <ProductUpdates {...this.props} />;
        break;
      case 'copy':
        page = <Copy {...this.props} />;
        break;
      case 'lookup':
        page = <SkillLookup {...this.props} />;
        break;
      case 'vendors':
        page = <Vendors {...this.props} />;
        break;
      case 'charges':
        page = <FinanceBoard {...this.props} />;
        break;
      case 'template':
        page = <Template {...this.props} />;
        break;
      default:
        page = <Home {...this.props} />;
    }

    return (
      <>
        <Header withLogo history={this.props.history} />
        <div className="admin Window">
          <div md="3" className="sidebar">
            <div className="title">Tools</div>
            <ButtonGroup vertical>
              {tabs.map((tab, i) => {
                if (tab.match.includes(this.props.page)) {
                  return (
                    <div key={i} className="active-btn">
                      {tab.display}
                    </div>
                  );
                }
                return (
                  <Link key={i} to={tab.link} className="inactive-btn">
                    {tab.display}
                  </Link>
                );
              })}
            </ButtonGroup>
          </div>
          <div md="9" className="admin-page">
            {page}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  teams: state.team,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTeams: () => dispatch(fetchTeams()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
