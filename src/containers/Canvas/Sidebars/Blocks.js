import cn from 'classnames';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'reactstrap';

import { checkBlockDisabledLive, getSections } from '../Blocks';
import MenuItem from './components/MenuItem';

export class Blocks extends PureComponent {
  constructor(props) {
    super(props);

    // Store state of basic + advanced tabs
    let show = localStorage.getItem('show');
    if (!show) {
      show = {
        favorites: true,
        basic: true,
        logic: false,
        advanced: false,
        functional: false,
        business: false,
        symbols: false,
        flows: false,
      };
    } else {
      show = JSON.parse(show);
    }

    let tab = localStorage.getItem('block_tab');
    if (!tab) tab = 'blocks';
    const { type_counter } = this.props;
    this.state = {
      tab,
      show,
      sections: getSections(type_counter, this.props),
    };

    this.toggleBlockSection = this.toggleBlockSection.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    const { type_counter, user_modules } = this.props;

    if (props.type_counter !== type_counter || props.user_modules !== user_modules) {
      const sections = getSections(props.type_counter, props);
      this.setState({
        sections,
      });
    }
  }

  toggleBlockSection(section_title) {
    const s = this.state;
    s.show[section_title] = !s.show[section_title];
    localStorage.setItem('show', JSON.stringify(s.show));
    this.setState(s);
    this.forceUpdate();
  }

  render() {
    const { tab, sections, show } = this.state;
    const { user, live_mode } = this.props;
    let block_content;
    if (tab === 'blocks') {
      block_content = sections.map((section, i) => {
        return (
          <div key={i} className="section no-select">
            <div
              className="section-title"
              onClick={() => {
                this.toggleBlockSection(section.title);
              }}
            >
              <span>
                <i
                  className={cn('fas', 'fa-caret-down', 'mr-1', 'rotate', {
                    'fa-rotate--90': !show[section.title],
                  })}
                />
                {section.title}
              </span>
              <span
                className={cn(section.title, {
                  'title-dot': section.title !== 'favorites',
                })}
              />
            </div>
            <Collapse isOpen={show[section.title]}>
              {section.title === 'business' && user.admin === 0 ? (
                <div className="premium-block">
                  <div>
                    <span>Upgrade to access these premium features</span>
                    <Link className="btn-primary mt-3 d-block no-underline" to="/account/upgrade">
                      Upgrade
                    </Link>
                  </div>
                </div>
              ) : null}
              <div className="mb-3 section-blocks" style={section.title === 'business' && user.admin === 0 ? { opacity: 0.3 } : null}>
                {section.items.map((item, i) => {
                  if (item) {
                    return (
                      <MenuItem
                        item={item}
                        key={i}
                        data-tip={item.tip}
                        draggable={!((section.title === 'business' && user.admin === 0) || checkBlockDisabledLive(live_mode, item.type))}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </Collapse>
          </div>
        );
      });
    }
    return <React.Fragment>{block_content}</React.Fragment>;
  }
}

const mapStateToProps = (state) => ({
  live_mode: state.skills.live_mode,
  diagrams: state.diagrams.diagrams,
  skill_id: state.skills.skill.skill_id,
  project_id: state.skills.skill.project_id,
  user_modules: state.skills.user_modules,
  user: state.account,
});
export default connect(mapStateToProps)(Blocks);
