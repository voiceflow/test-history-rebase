import cn from 'classnames';
import moment from 'moment';
import React from 'react';

const class_mapping = {
  FEATURE: {
    class: 'update-modal-feature',
    label: 'New Feature',
  },
  UPDATE: {
    class: 'update-modal-update',
    label: 'Update',
  },
  CHANGE: {
    class: 'update-modal-change',
    label: 'Change',
  },
};

class UpdatesPopover extends React.Component {
  render() {
    const { product_updates, new_product_updates } = this.props;
    return (
      <div className="text-center pt-1 pb-1">
        {Array.isArray(product_updates) &&
          product_updates.map((entry, i) => {
            return (
              <React.Fragment key={i}>
                <div align="left" className="pr-1 pl-1">
                  {new_product_updates.includes(entry) && (
                    <p className={cn('d-inline-block mb-0 ', class_mapping[entry.type].class)}>&bull; {class_mapping[entry.type].label}:&nbsp;</p>
                  )}
                  {/* eslint-disable-next-line xss/no-mixed-html */}
                  <p className="d-inline-block mb-1" dangerouslySetInnerHTML={{ __html: entry.details }} />
                  <p className="text-secondary mb-0">{moment(entry.created).fromNow()}</p>
                </div>
                {i !== product_updates.length - 1 && <hr className="w-100" />}
              </React.Fragment>
            );
          })}
      </div>
    );
  }
}

export default UpdatesPopover;
