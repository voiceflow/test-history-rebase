import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Collapsible from '../Collapsible';

export default function PopoverCollapse({ label, children, ...props }) {
  return (
    <Collapsible {...props}>
      {({ opened, onToggleOpened }) => (
        <div className={cn('popover-panel __collapsible', { '__is-active': opened })}>
          <div onClick={onToggleOpened} className="popover-panel-header">
            <div className="popover-panel-header__title">{label}</div>
          </div>

          {opened && <div className="popover-panel-body">{children}</div>}
        </div>
      )}
    </Collapsible>
  );
}

PopoverCollapse.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
