import cn from 'classnames';
import Markdown from 'markdown-to-jsx';
import moment from 'moment';
import React from 'react';

import { styled, units } from '@/hocs';

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

export const NotificationContainer = styled.div`
  padding: ${units(1.5)}px;

  & > * {
    white-space: normal;
  }
`;

class UpdatesPopover extends React.Component {
  render() {
    const { product_updates, new_product_updates } = this.props;
    return (
      <NotificationContainer>
        {Array.isArray(product_updates) &&
          product_updates.map((entry, i) => {
            return (
              <React.Fragment key={i}>
                <div align="left" className="pr-1 pl-1 app-notification">
                  {new_product_updates.includes(entry) && (
                    <p className={cn('d-inline-block mb-0 ', class_mapping[entry.type].class)}>&bull; {class_mapping[entry.type].label}:&nbsp;</p>
                  )}
                  {/* eslint-disable-next-line xss/no-mixed-html */}
                  <div className="d-inline-block mb-1">
                    <Markdown>{entry.details}</Markdown>
                  </div>

                  <p className="text-secondary mb-0">{entry.created ? moment(entry.created).fromNow() : ''}</p>
                </div>
                {i !== product_updates.length - 1 && <hr className="w-100" />}
              </React.Fragment>
            );
          })}
      </NotificationContainer>
    );
  }
}

export default UpdatesPopover;
