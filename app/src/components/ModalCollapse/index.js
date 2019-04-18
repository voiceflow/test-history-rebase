import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Collapsible from '../Collapsible';

export default function ModalCollapse({ label, children, asideRenderer, ...props }) {
  return (
    <Collapsible {...props}>
      {({ opened, onToggleOpened }) => {
        const aside = asideRenderer && asideRenderer({ opened });

        return (
          <div className={cn('modal-panel __collapsible', { '__is-active': opened })}>
            <div onClick={onToggleOpened} className="modal-panel-header">
              <div className="modal-panel-header__title">{label}</div>

              {!!aside && <div className="modal-panel-header__aside">{aside}</div>}
            </div>

            {opened && <div className="modal-panel-body">{children}</div>}
          </div>
        );
      }}
    </Collapsible>
  );
}

ModalCollapse.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  asideRenderer: PropTypes.func,
};
