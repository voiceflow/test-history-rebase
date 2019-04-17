import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../../../Icon';

export default function CategoriesList({ items, onItemClick }) {
  return (
    <ul className="skill-categories-list">
      {items.map(item => (
        <li
          key={item.id}
          onClick={() => !item.disabled && onItemClick(item)}
          className={cn('skill-categories-list__list-item', { '__type-category': item.disabled })}
        >
          <div className="skill-categories-list__item">
            {!!item.icon && (
              <div className="skill-categories-list__icon">
                <Icon className={item.icon} />
              </div>
            )}
            <div className="skill-categories-list__title">{item.label}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

CategoriesList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.string.bool,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
};
