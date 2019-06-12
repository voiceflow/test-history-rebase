import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';

export default function GroupFormInline({ cols, className }) {
  return (
    <div className={cn('groupform-inline', className)}>
      {cols.map((item, i) => {
        if (!item) {
          return null;
        }

        const { content, className } = item;

        return (
          <div key={i} className={cn('groupform-inline__col', className)}>
            {content}
          </div>
        );
      })}
    </div>
  );
}

GroupFormInline.propTypes = {
  cols: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node,
      className: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};
