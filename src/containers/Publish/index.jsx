import './Skill.css';

import cloneDeep from 'lodash/cloneDeep';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

import { userSelector } from '@/ducks/account';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import PublishAmazon from './Amazon';
import PublishGoogle from './Google';
import Sidebar from './components/PublishSidebar';
import SidebarItem from './components/PublishSidebarItem';

const updateLink = (link, skillID) => {
  return link.replace(':skill_id', skillID);
};

const tabs = [
  {
    // eslint-disable-next-line react/display-name
    display: (key) => (
      <React.Fragment key={key}>
        <i className="fab fa-amazon mr-2" /> Alexa
      </React.Fragment>
    ),
    match: ['alexa'],
    link: '/publish/:skill_id',
  },
  {
    // eslint-disable-next-line react/display-name
    display: (key) => (
      <React.Fragment key={key}>
        <i className="fab fa-google mr-2" /> Google{' '}
        <Badge color="primary" className="beta-badge align-middle ml-1">
          Beta
        </Badge>
      </React.Fragment>
    ),
    match: ['google'],
    link: '/publish/:skill_id/google',
  },
];

class Publish extends Component {
  constructor(props) {
    super(props);

    const TABS = cloneDeep(tabs);

    this.state = {
      tabs: TABS,
    };
  }

  render() {
    const { page: propsPage, skillID } = this.props;
    const { tabs } = this.state;

    let page;
    if (propsPage === 'google') {
      page = <PublishGoogle {...this.props} />;
    } else {
      page = <PublishAmazon {...this.props} />;
    }

    return (
      <div id="business">
        <Sidebar md="3">
          {tabs.map((tab, i) => {
            let res;
            if (tab.match.includes(propsPage)) {
              res = <SidebarItem isActive>{tab.display(i)}</SidebarItem>;
            } else {
              res = (
                <SidebarItem as={Link} to={updateLink(tab.link, skillID)}>
                  {tab.display(i)}
                </SidebarItem>
              );
            }
            return <React.Fragment key={i}>{res}</React.Fragment>;
          })}
        </Sidebar>
        <div md="9" className="business-page">
          {page}
        </div>
      </div>
    );
  }
}

const mapStateToProps = {
  user: userSelector,
  skillID: activeSkillIDSelector,
  platform: activePlatformSelector,
};

export default connect(mapStateToProps)(Publish);
