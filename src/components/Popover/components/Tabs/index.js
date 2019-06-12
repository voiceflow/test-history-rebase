import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';

export default function Tabs({ list, active, onChange }) {
  return (
    <div className="popover-tabs-list">
      {list.map(({ id, content }) => (
        <div key={id} className="popover-tabs-list__list-item">
          <div onClick={() => onChange(id)} className={cn('popover-tabs-list__item', { '__is-active': id === active })}>
            {content}
          </div>
        </div>
      ))}
    </div>
  );
}

Tabs.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
