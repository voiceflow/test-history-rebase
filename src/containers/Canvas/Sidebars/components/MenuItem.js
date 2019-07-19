import cn from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';

import { ALLOWED_GOOGLE_BLOCKS } from '../../Constants';

const MenuItem = ({ draggable, item, platform, data, name }) => (
  <div className="wrap" style={!draggable ? { opacity: 0.3 } : null}>
    <div
      className={cn('MenuItem', item.type, {
        'faded-node': platform === 'google' && !ALLOWED_GOOGLE_BLOCKS.includes(item.type),
      })}
      draggable={draggable}
      onDragStart={(event) => {
        event.stopPropagation();
        window.Appcues.track('block dragged');
        event.dataTransfer.setData('node', item.type);
        if (data) {
          event.dataTransfer.setData('data', data);
        }
        if (name) {
          event.dataTransfer.setData('name', name);
        }
      }}
    >
      <div
        className={cn('MenuIcon', {
          'module-icon': item.type === 'symbol',
        })}
      >
        {item.icon}
      </div>
      <div className="MenuText">
        <span>{item.text}</span>
        {draggable ? (
          <Tooltip html={item.tip} className="menu-tip" theme="menu" position="bottom">
            &nbsp;&nbsp;
          </Tooltip>
        ) : null}
      </div>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  platform: state.skills.skill.platform,
  project_id: state.skills.skill.project_id,
});
export default connect(mapStateToProps)(MenuItem);
